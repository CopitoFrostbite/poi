const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express(); 
const server = require ("http").Server(app);
const socketio = require("socket.io")(server);
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const { use } = require("./routes/user");

 
require("dotenv").config();

app.set("port",process.env.PORT || 3000);
require("./socket")(socketio);

//middleware
app.use(express.json());
app.use('/api',userRoutes);




app.use(express.static(path.join(__dirname,"front/login" ))); 
//app.use(express.json());
//app.use(cors({ origin: true }));
   
  
//app.post("/authenticate", async (req, res) => {
//  const { username } = req.body;
//  return res.json({ username: username, secret: "sha256..." }); 
//});

//routes
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

 
  
//  app.listen(port, () => {
//    console.log("Example app listening at http://localhost:${port}");
//  });
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("atlas"))
.catch((error) => console.error(error));
server.listen(app.get("port"),() =>
{
  console.log("Servidor en el puerto",app.get("port"));
}
)