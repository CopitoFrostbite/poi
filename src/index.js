const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const app = express(); 
const server = require("http").createServer(app);
const io = require("socket.io")(server,{
  cors:{
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const messagesRoutes = require("./routes/messages");
const conversationsRoutes = require("./routes/conversations");
const { use } = require("./routes/user");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
//const socket = require("./socket");

 //variables de entorno
require("dotenv").config();
app.set("port",process.env.PORT || 3001);
//require("./socket")(socketio);

//middleware
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());
app.use('/api',userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/conversations",conversationsRoutes);
app.use("/api/messages",messagesRoutes);
app.use(cors());
app.use(morgan('start'));
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());



let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", socket => {
 console.log(socket.id);
 console.log('usuario conectado');
 //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

    

 socket.on("message",(message, usuario) =>{
  // envio al resto de clientes
  socket.broadcast.emit("message",{
          
    body: message,
    from: usuario
    })
  })

  socket.on('chat message', (DataToRecieve) => {
    console.log(DataToRecieve)
    io.emit('chat message', DataToRecieve);
  })
      
  socket.on('group message', (DataToRecieve) => {
    console.log(DataToRecieve)
    io.emit('group message', DataToRecieve);
  })
      
  socket.on('req message', (DataToRecieve) => {
    console.log(DataToRecieve)
    io.emit('req message', DataToRecieve);
  })
      
        
      
  socket.on('join-room', (roomId, userId) => {
    console.log("room: "+roomId)
    console.log("usuario: "+userId)
    socket.broadcast.emit('user-connected', userId)
          
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userId)
    })
  })
});

app.use(express.static(path.join(__dirname,"front/login" ))); 
  
  
//app.post("/authenticate", async (req, res) => {
//  const { username } = req.body;
//  return res.json({ username: username, secret: "sha256..." }); 
//});


  
//  app.listen(port, () => {
//    console.log("Example app listening at http://localhost:${port}");
//  });
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true})
.then(() => console.log("atlas"))
.catch((error) => console.error(error));
server.listen(app.get("port"),() =>
{
  console.log("Servidor en el puerto",app.get("port"));
}
)