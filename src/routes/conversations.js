const express = require("express");
const conversationSchema = require("../models/Conversation");
const router = express.Router();
//new conv

router.post("/", async (req, res) => {
  const newConversation = new conversationSchema({
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
  const newConversation = new conversationSchema({
    members: req.body.members, 
    group: true, 
    subgroup: req.body.subgroup 
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await conversationSchema.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await conversationSchema.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
