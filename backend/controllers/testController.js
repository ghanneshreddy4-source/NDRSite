const Test = require("../models/Test");

// Get test details by ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id).populate("topic", "title");
    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (err) {
    console.error("getTestById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit test response and calculate score
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body; // answers = [index1, index2 ...]

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let score = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score++;
    });

    res.json({
      message: "Test submitted",
      total: test.questions.length,
      score
    });
  } catch (err) {
    console.error("submitTest:", err);
    res.status(500).json({ message: "Server error" });
  }
};
