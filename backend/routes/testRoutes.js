const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const testController = require("../controllers/testController");

router.use(auth);

// Get test by ID
router.get("/:id", testController.getTestById);

// Submit answers
router.post("/submit", testController.submitTest);

module.exports = router;
