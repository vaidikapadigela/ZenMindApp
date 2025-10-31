import express from "express";
import Journal from "../models/journal.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all journals for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new journal entry
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, mood, date, journal, tags } = req.body;

    if (!journal?.trim()) {
      return res.status(400).json({ message: "Journal text cannot be empty." });
    }

    const newJournal = new Journal({
      userId: req.userId,
      title: title || "Untitled",
      mood: mood || "Neutral",
      date: date || new Date(),
      journal,
      tags: tags || [],
    });

    await newJournal.save();
    res.json(newJournal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update journal entry
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, mood, date, journal, tags } = req.body;
    const updated = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, mood, date, journal, tags, edited: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found or not authorized" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete journal entry
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Journal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Journal entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
