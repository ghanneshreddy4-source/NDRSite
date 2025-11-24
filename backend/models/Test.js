const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true }
});

const testSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    title: { type: String, required: true },
    questions: [questionSchema],
    durationMinutes: { type: Number, default: 30 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
