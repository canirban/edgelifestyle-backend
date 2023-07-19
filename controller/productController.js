const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const Product = require("../models/Product");

const createProduct = async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate("reviews");
  res.status(StatusCodes.OK).json({ products });
};
const getSingleProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product)
    throw new NotFoundError(`No product found with id : ${productId}`);
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product)
    throw new NotFoundError(`No product found with id : ${productId}`);
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product)
    throw new NotFoundError(`No product found with id : ${productId}`);
  await product.deleteOne();
  res
    .status(StatusCodes.OK)
    .json({ msg: `Product with id : ${productId} removed successfully` });
};
const uploadProductImage = async (req, res) => {};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
