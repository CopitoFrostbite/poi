const express = require("express");
const Conversation = require("../models/Conversation");
const router = express.Router();

module.exports = (io) => {
// Crear una nueva conversación
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
    group: false,
    subgroup: "",
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Crear una conversación grupal
router.post("/group", async (req, res) => {
  const newConversation = new Conversation({
    members: req.body.members,
    group: true,
    subgroup: req.body.subgroup,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Obtener las conversaciones de un usuario
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Obtener una conversación que incluya a dos usuarios específicos
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

return router;
}