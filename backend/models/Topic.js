const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String }, // YouTube link or file path
    order: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", topicSchema);
