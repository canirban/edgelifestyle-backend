const express = require("express");
const router = express.Router();
const {
  login,
  register,
  verifyEmail,
} = require("../controller/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);

module.exports = router;
