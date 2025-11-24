// backend/server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const MajorTest = require("./models/MajorTest");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();

// ============ CORS =============
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// ============ MIDDLEWARE ============
app.use(express.json());
app.use(cookieParser());

// ============ STATIC FRONTEND ============
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ============ ROUTES ============
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/queries", require("./routes/queryRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/tests", require("./routes/testRoutes"));

// ============ REMINDER JOB ============
setInterval(async () => {
  try {
    const now = new Date();
    const twoDaysLater = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    const tests = await MajorTest.find({
      scheduledAt: { $gte: now, $lte: twoDaysLater },
      reminderSent: false,
    }).populate("course");

    if (!tests.length) return;

    const activeUsers = await User.find({ status: "active" });

    for (const test of tests) {
      for (const user of activeUsers) {
        user.notifications.push({
          message: `Reminder: Major test "${test.title}" for course "${test.course.name}" is scheduled on ${test.scheduledAt.toDateString()}`,
          type: "reminder",
        });
        await user.save();
      }
      test.reminderSent = true;
      await test.save();
    }

    console.log("📢 Reminders sent for upcoming major tests");
  } catch (err) {
    console.error("❌ Reminder job error:", err);
  }
}, 60 * 60 * 1000);

// ============ FALLBACK (SPA STYLE) ============
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// ============ START ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("✅ MongoDB Connected Successfully");
});
