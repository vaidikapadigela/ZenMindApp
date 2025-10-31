import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/user.js'

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
if (existingUser)
  return res.status(400).json({ message: "Username already exists" });

const existingEmail = await User.findOne({ email });
if (existingEmail)
  return res.status(400).json({ message: "Email already exists" });


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;
    console.log("Login attempt:", username, password);

    const user = await User.findOne({ username });
    console.log("Found user:", user);

    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" }
    );

    console.log("✅ User logged in:", username);
    res.json({
  token,
  user: {
    username: user.username,
    email: user.email,
  },
});

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GOOGLE LOGIN / REGISTER
router.post("/google", async (req, res) => {
  try {
    const { email, displayName, googleId, photoURL } = req.body;

    if (!email || !googleId)
      return res.status(400).json({ message: "Invalid Google data" });

    let user = await User.findOne({ email });
    if (!user) {
          user = new User({
      username: displayName || email.split("@")[0],
      email,
      password: "GOOGLE_AUTH_USER", // ✅ dummy value to satisfy validation
      googleId,
      photoURL,
      isGoogleUser: true,
    });
    await user.save();
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, username: user.username, isGoogleUser: true });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
