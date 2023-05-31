const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length >= 2;
        },
        message: "Debe haber al menos dos miembros en la conversación",
      },
    },
    group: {
      type: Boolean,
      required: true,
    },
    subgroup: {
      type: String,
      validate: {
        validator: function(str) {
          return this.group ? str.length > 0 : true;
        },
        message: "El campo de subgrupo es obligatorio si la conversación es un subgrupo",
      },
    },
    messages: {
      type: [String], // Almacena los IDs de los mensajes relacionados
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
