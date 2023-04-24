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
    type: String
    
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
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
   
  },
  { timestamps: true }

);

module.exports = mongoose.model("user",userSchema);