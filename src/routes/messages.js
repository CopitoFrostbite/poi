const router = require("express").Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

module.exports = (io) => {
  // Guardar un nuevo mensaje
  router.post("/", async (req, res) => {
    const { conversationId, sender, text, encrypted, media } = req.body;

    const newMessage = new Message({
      conversationId,
      sender,
      text,
      encrypted,
      media, // Agrega el campo "media" al nuevo mensaje
    });

    try {
      const savedMessage = await newMessage.save();

      // Agrega el ID del mensaje a la conversación correspondiente
      const conversation = await Conversation.findById(conversationId);
      conversation.messages.push(savedMessage._id);
      await conversation.save();

      // Emite un evento para notificar sobre un nuevo mensaje
      io.emit("newMessage", savedMessage);

      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Obtener los mensajes de una conversación
  router.get("/:conversationId", async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  return router;
};




