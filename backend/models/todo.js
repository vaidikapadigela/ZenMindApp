import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: String},
  time: { type: String},
}, { timestamps: true });

export default mongoose.model("Todo", todoSchema);
