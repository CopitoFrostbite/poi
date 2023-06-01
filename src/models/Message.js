const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    encrypted: {
      type: Boolean,
      default: false,
    },
    media: {
      data: Buffer, // Datos binarios de la multimedia
      contentType: String, // Tipo de contenido de la multimedia (por ejemplo, "image/jpeg", "video/mp4", etc.)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);


