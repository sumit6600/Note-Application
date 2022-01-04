const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerController,
  authUser,
  updateUserProfile,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/", registerController);
router.route("/login").post(authUser);
router.route("/profile").post(protect, updateUserProfile);

module.exports = router;
