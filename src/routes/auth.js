const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
    }

    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      nombre: "",
      correo: req.body.correo,
      password: hashedPassword,
      profilePicture: "",
      coverPicture: "",
      desc: "",
      city: "",
      from: "",
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json({success: true, user});
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    
    res.header("auth-token", token).json({
      error: null,
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

module.exports = router;
