const Query = require("../models/Query");

exports.createQuery = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const query = await Query.create({
      user: req.user._id,
      subject,
      messages: [{ sender: "client", text: message }]
    });
    res.status(201).json(query);
  } catch (err) {
    console.error("createQuery:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyQueries = async (req, res) => {
  try {
    const queries = await Query.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error("getMyQueries:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.replyAsClient = async (req, res) => {
  try {
    const { queryId, text } = req.body;
    const query = await Query.findOne({ _id: queryId, user: req.user._id });
    if (!query) return res.status(404).json({ message: "Query not found" });

    query.messages.push({ sender: "client", text });
    await query.save();
    res.json(query);
  } catch (err) {
    console.error("replyAsClient:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin side
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error("getAllQueries:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.replyAsAdmin = async (req, res) => {
  try {
    const { queryId, text } = req.body;
    const query = await Query.findById(queryId);
    if (!query) return res.status(404).json({ message: "Query not found" });

    query.messages.push({ sender: "admin", text });
    await query.save();
    res.json(query);
  } catch (err) {
    console.error("replyAsAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};
