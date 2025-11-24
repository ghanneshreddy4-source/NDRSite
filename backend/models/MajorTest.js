const mongoose = require("mongoose");

const majorTestSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    reminderSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MajorTest", majorTestSchema);
