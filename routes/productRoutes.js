const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  verifyAdmin,
} = require("../middleware/authentication");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require("../controller/productController");

router
  .route("/")
  .post([authenticateUser, verifyAdmin], createProduct)
  .get(getAllProducts);
router
  .route("/uploadImage")
  .post([authenticateUser, verifyAdmin], uploadProductImage);
router
  .route("/:productId")
  .get(getSingleProduct)
  .patch([authenticateUser, verifyAdmin], updateProduct)
  .delete([authenticateUser, verifyAdmin], deleteProduct);

module.exports = router;
