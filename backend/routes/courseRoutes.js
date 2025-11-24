const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseDetail);

module.exports = router;
