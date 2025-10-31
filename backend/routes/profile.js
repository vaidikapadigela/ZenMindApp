import User from '../models/user.js'
import { verifyToken } from '../middleware/auth.js';
import express from "express";
const router = express.Router();
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    // Example additional data (streak, tasks)
    const profileData = {
      email: user.email,
      streak: 0,
      pendingTasks: 0,
      recentJournals: []
    };

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;