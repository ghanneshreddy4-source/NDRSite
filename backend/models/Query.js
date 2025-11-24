const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["client", "admin"], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const querySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    messages: [messageSchema],
    status: { type: String, enum: ["open", "closed"], default: "open" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);
