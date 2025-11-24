const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Client
router.post("/", auth, queryController.createQuery);
router.get("/mine", auth, queryController.getMyQueries);
router.post("/reply/client", auth, queryController.replyAsClient);

// Admin
router.get("/", auth, adminAuth, queryController.getAllQueries);
router.post("/reply/admin", auth, adminAuth, queryController.replyAsAdmin);

module.exports = router;
