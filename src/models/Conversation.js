const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length >= 2; // Verifica que haya al menos dos miembros en la conversación
        },
        message: "Debe haber al menos dos miembros en la conversación",
      },
    },
    group:{
      type: Boolean,
      required: true,
    },
    subgroup:{
      type: String,
      validate: {
        validator: function(str) {
          return this.group ? str.length > 0 : true; // Verifica que haya un subgrupo solo si la conversación es grupal
        },
        message: "El campo de subgrupo es obligatorio si la conversación es un subgrupo",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
