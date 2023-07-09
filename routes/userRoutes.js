const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controller/userController");
const {
  authenticateUser,
  verifyAdmin,
} = require("../middleware/authentication");

router.route("/").get(authenticateUser, verifyAdmin, getAllUsers);
router.route("/current").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updatePassword").patch(authenticateUser, updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);
module.exports = router;
