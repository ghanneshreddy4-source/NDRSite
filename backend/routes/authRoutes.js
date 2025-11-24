// backend/routes/authRoutes.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Min 6 chars password"),
  ],
  authController.register
);

router.post("/login", authController.login);
router.get("/me", auth, authController.getMe);
router.post("/logout", auth, authController.logout);

module.exports = router;
