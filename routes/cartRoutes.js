const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getCart,
  deleteCart,
  getAllCarts,
} = require("../controller/cartController");
const {
  authenticateUser,
  verifyAdmin,
} = require("../middleware/authentication");

router.post("/add-product", authenticateUser, addToCart);
router.post("/remove-product", authenticateUser, removeFromCart);
router
  .route("/cart")
  .get(authenticateUser, getCart)
  .delete(authenticateUser, deleteCart);
router.get("/all-carts", [authenticateUser, verifyAdmin], getAllCarts);

module.exports = router;
