import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    mood: { type: String, required: true },
    date: { type: String, required: true },
    journal: { type: String, required: true },
    tags: { type: [String], default: [] },
    addToCalendar: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Journal", journalSchema);
