import express from "express";
import Todo from '../models/todo.js'
import { verifyToken } from "../middleware/auth.js"; // JWT auth middleware

const router = express.Router();

// Get all todos for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo
router.post("/", verifyToken, async (req, res) => {
  try {
    const { text,date,time } = req.body;
    const newTodo = new Todo({ text, date,time,userId: req.userId });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update todo (complete/uncomplete)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { completed } = req.body;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete todo
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
