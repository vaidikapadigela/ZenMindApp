import mongoose from "mongoose";

const gratitudeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [String], required: true },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Gratitude", gratitudeSchema);
