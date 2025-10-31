import express from "express";
import Gratitude from "../models/gratitude.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all gratitude logs
router.get("/", verifyToken, async (req, res) => {
  try {
    const logs = await Gratitude.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new gratitude log
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length < 1) {
      return res.status(400).json({ message: "At least one gratitude item is required." });
    }

    const newLog = new Gratitude({
      userId: req.userId,
      items,
    });

    await newLog.save();
    res.json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update (edit) a gratitude log
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const updatedLog = await Gratitude.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { items, edited: true },
      { new: true }
    );
    res.json(updatedLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a gratitude log
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Gratitude.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Gratitude log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
