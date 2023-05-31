const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const User = require('./models/user');
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
    methods: ["GET", "POST"]
  }
});

// Importación de rutas
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const messagesRoutes = require("./routes/messages")(io);
const conversationsRoutes = require("./routes/conversations")(io);

// Configuración del puerto
const port = process.env.PORT || 3001;
app.set("port", port);

// Middleware
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(cors());
app.use(express.json());
app.use(morgan('start'));
app.use(helmet());

// Rutas
app.use('/api', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use(express.static(path.join(__dirname, "front/login")));

// Usuarios conectados
let users = [];

const addUser = async (userId, socketId) => {
  const user = await User.findById(userId);
  if (user) {
    const existingUser = users.find(u => u.userId === userId);
    if (!existingUser) {
      users.push({ userId, socketId });
    }
  }
};

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Conexión de Socket.io
io.on("connection", socket => {
  console.log(socket.id);
  console.log('usuario conectado');

  // Agregar usuario
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // Enviar y recibir mensajes
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });

    io.emit("updateChat", {
      senderId,
      receiverId,
      text,
    });
  });

  // Desconexión del usuario
  socket.on('disconnect', () => {
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
  });
});

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("Atlas connected"))
  .catch((error) => console.error(error));

// Iniciar servidor
server.listen(port, () => {
  console.log("Servidor en el puerto", port);
});
