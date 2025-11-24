const User = require("../models/User");
const Course = require("../models/Course");
const Topic = require("../models/Topic");
const Test = require("../models/Test");
const MajorTest = require("../models/MajorTest");

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "pending", role: "client" });
    res.json(users);
  } catch (err) {
    console.error("getPendingUsers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { userId, status } = req.body; // status: "active" or "rejected"
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status || "active";
    await user.save();

    res.json({ message: `User ${status}`, user });
  } catch (err) {
    console.error("approveUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const course = await Course.create({ name, description, category });
    res.status(201).json(course);
  } catch (err) {
    console.error("addCourse:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    await Topic.deleteMany({ course: id });
    await MajorTest.deleteMany({ course: id });
    res.json({ message: "Course and related data deleted" });
  } catch (err) {
    console.error("deleteCourse:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addTopic = async (req, res) => {
  try {
    const { courseId, title, description, videoUrl, order } = req.body;
    const topic = await Topic.create({
      course: courseId,
      title,
      description,
      videoUrl,
      order
    });
    res.status(201).json(topic);
  } catch (err) {
    console.error("addTopic:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addTest = async (req, res) => {
  try {
    const { topicId, title, questions, durationMinutes } = req.body;
    const test = await Test.create({
      topic: topicId,
      title,
      questions,
      durationMinutes
    });
    res.status(201).json(test);
  } catch (err) {
    console.error("addTest:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addMajorTest = async (req, res) => {
  try {
    const { courseId, title, description, scheduledAt, durationMinutes } = req.body;
    const test = await MajorTest.create({
      course: courseId,
      title,
      description,
      scheduledAt,
      durationMinutes
    });
    res.status(201).json(test);
  } catch (err) {
    console.error("addMajorTest:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.postAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    // Push notification to all active users
    const users = await User.updateMany(
      { status: "active" },
      {
        $push: {
          notifications: {
            message,
            type: "announcement"
          }
        }
      }
    );
    res.json({ message: "Announcement sent", result: users });
  } catch (err) {
    console.error("postAnnouncement:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getClientPerformance = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "name email streak attendance performanceScore enrolledCourses"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getClientPerformance:", err);
    res.status(500).json({ message: "Server error" });
  }
};
