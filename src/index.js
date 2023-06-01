const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const User = require('./models/user');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const morgan = require("morgan");

// Variables de entorno
require("dotenv").config();

// Configuración de Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Importación de rutas
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const messagesRoutes = require("./routes/messages")(io);
const conversationsRoutes = require("./routes/conversations")(io);
const uploadRoutes = require("./routes/upload");

// Configuración del puerto
const port = process.env.PORT || 3001;
app.set("port", port);

// Middleware
/* app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}); */
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
//app.use(morgan('start'));
app.use(helmet());

// Rutas
app.use('/api', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, "front/login")));

// Usuarios conectados
let users = [];
const connectedUsers = new Map(); 
// Conexión de Socket.io
io.on("connection", socket => {
  
  
  // Evento para manejar la desconexión de un cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    // Eliminar al usuario de la lista de usuarios conectados
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      connectedUsers.delete(socket.id);
      io.emit('userDisconnected', userId);
    }
  });

  socket.on('shareLocation', (location) => {
    // Transmitir la ubicación a otros usuarios conectados
    socket.broadcast.emit('newLocation', location);
  });

  // Evento para agregar un usuario a la lista de usuarios conectados
  socket.on('addUser', (userId) => {
  console.log('Usuario conectado:', userId);
  // Agregar al usuario a la lista de usuarios conectados
  connectedUsers.set(socket.id, userId);
  io.emit('userConnected', userId);
  });



  socket.on("sendMessage", async ({ sender, conversationId, text, encrypted, media }) => {
    const message = new Message({
      conversationId,
      sender,
      text,
      encrypted,
      media, 
    });
  
    try {
      const savedMessage = await message.save();
  
      const user = getUser(conversationId);
      io.to(user.socketId).emit("getMessage", {
        sender,
        text: savedMessage.text,
        encrypted: savedMessage.encrypted,
        media: savedMessage.media, 
      });
  
      io.emit("updateChat", {
        sender,
        conversationId,
        text: savedMessage.text,
        encrypted: savedMessage.encrypted,
        media: savedMessage.media, 
      });
    } catch (error) {
      console.log(error);
    }
  });

  // Desconexión del usuario
  /* socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit('getUsers', users);
  });

  socket.on("message", (message, usuario) => {
    socket.broadcast.emit("message", {
      body: message,
      from: usuario
    });
  });

  socket.on('chat message', (DataToRecieve) => {
    console.log(DataToRecieve)
    io.emit('chat message', DataToRecieve);
  });

  socket.on('group message', (DataToRecieve) => {
    console.log(DataToRecieve)
    io.emit('group message', DataToRecieve);
  });

  socket.on('req message', (DataToRecieve) => {
    console.log(DataToRecieve)
    io.emit('req message', DataToRecieve);
  });

  socket.on('join-room', (roomId, userId) => {
    console.log("room: " + roomId)
    console.log("usuario: " + userId)
    socket.broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userId)
    })
  }); */
});

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("Atlas connected"))
  .catch((error) => console.error(error));

// Iniciar servidor
server.listen(port, () => {
  console.log("Servidor en el puerto", port);
});
