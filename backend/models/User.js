const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, default: "info" },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "admin"], default: "client" },
    status: { type: String, enum: ["pending", "active", "rejected"], default: "pending" },
    profilePicUrl: { type: String },
    streak: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 0 },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    notifications: [notificationSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
