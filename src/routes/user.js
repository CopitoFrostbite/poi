const express = require("express");
const userSchema = require("../models/user");
const router = express.Router();
// crear usuario
router.post("/user",(req,res) => 
{
   const user = userSchema(req.body);
   user
   .save()
   .then((data) => res.json(data))
   .catch((error) => res.json({ message:error}));
});

// obtener todos los usuarios
router.get("/user",(req,res) => 
{
   const user = userSchema(req.body);
   userSchema
   .find()
   .then((data) => res.json(data))
   .catch((error) => res.json({ message:error}));
});

// obtener un usuario
router.get("/user/:id",(req,res) => 
{
   const {id}= req.params;
   userSchema
   .findById(id)
   .then((data) => res.json(data))
   .catch((error) => res.json({ message:error}));
});

// actualizar un usuario
router.put("/user/:id",(req,res) => 
{
   const {id}= req.params;
   const {nombre, correo} = req.body;
   userSchema
   .updateOne({_id: id},{$set: {nombre,correo}})
   .then((data) => res.json(data))
   .catch((error) => res.json({ message:error}));
});

// borrar un usuario
router.delete("/user/:id",(req,res) => 
{
   const {id}= req.params;
   
   userSchema
   .deleteOne({_id: id})
   .then((data) => res.json(data))
   .catch((error) => res.json({ message:error}));
});

module.exports = router;