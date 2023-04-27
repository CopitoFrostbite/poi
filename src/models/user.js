const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
   nombre:{
    type: String,
    
   },
   correo:{
    type: String,
    required: true
   },
   password: {
      type: String,
      required: true,
      min: 6,
    },
    carrera: {
      type: String,
      required: true,
      enum: ['LM', 'LF', 'LCC', 'Actuaria', 'LMAD', 'LSTI']
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
   
   
  },
  { timestamps: true }

);

module.exports = mongoose.model("user",userSchema);