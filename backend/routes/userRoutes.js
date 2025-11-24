const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

// Get profile
router.get("/profile", auth, userController.getProfile);

// Update profile
router.put("/profile", auth, userController.updateProfile);

module.exports = router;
