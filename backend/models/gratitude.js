import mongoose from "mongoose";

const gratitudeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  entries: [{ type: String, required: true }],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Gratitude", gratitudeSchema);