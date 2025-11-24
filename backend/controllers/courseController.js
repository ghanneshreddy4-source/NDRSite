const Course = require("../models/Course");
const Topic = require("../models/Topic");
const MajorTest = require("../models/MajorTest");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
  } catch (err) {
    console.error("getCourses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const topics = await Topic.find({ course: id }).sort({ order: 1 });
    const majorTests = await MajorTest.find({ course: id }).sort({ scheduledAt: 1 });

    res.json({ course, topics, majorTests });
  } catch (err) {
    console.error("getCourseDetail:", err);
    res.status(500).json({ message: "Server error" });
  }
};
