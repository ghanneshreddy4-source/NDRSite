// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let { name, email, password } = req.body;
    email = email.trim().toLowerCase();

    let existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "client",
      status: "pending",
    });

    res.status(201).json({
      message: "Registration successful. Waiting for admin approval.",
      userId: user._id,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    console.log("🔐 Login attempt:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // normal bcrypt compare
    let match = await bcrypt.compare(password, user.password);

    // dev fallback: in case admin password is stored as plain text "admin123"
    if (!match && user.email === "admin@ndr.com" && password === "admin123") {
      match = true;
      console.log("⚠ Using DEV fallback password match for admin@ndr.com");
    }

    if (!match) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res
        .status(403)
        .json({ message: "Your account is not approved yet by admin." });
    }

    const token = createToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user || null);
};

exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};
