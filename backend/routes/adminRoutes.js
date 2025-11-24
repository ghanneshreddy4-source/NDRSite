const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.use(auth, adminAuth);

router.get("/pending-users", adminController.getPendingUsers);
router.post("/approve-user", adminController.approveUser);

router.post("/course", adminController.addCourse);
router.delete("/course/:id", adminController.deleteCourse);

router.post("/topic", adminController.addTopic);
router.post("/test", adminController.addTest);
router.post("/major-test", adminController.addMajorTest);

router.post("/announcement", adminController.postAnnouncement);
router.get("/performance/:userId", adminController.getClientPerformance);

module.exports = router;
