const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  const { id: userId } = req.user;
  const { productId, quantity } = req.body;
  if (!productId || !quantity)
    throw new BadRequestError("Please provide product and quantity");
  const product = await Product.findOne({ _id: productId });
  if (!product)
    throw new BadRequestError(`Product with id : ${productId} not found`);

  if (product.inventory < quantity)
    throw new BadRequestError(
      `Not enough product in stock, quantity available : ${product.inventory}`
    );
  const cart = await Cart.findOne({ user: userId });

  if (!cart) cart = await Cart.create({ user: userId });

  const totalPrice = quantity * product.price;

  const cartItem = await CartItem.create({
    product: productId,
    quantity,
    user: userId,
    cartId: cart._id,
    eachItemPrice: product.price,
    totalPrice,
  });

  cart.cartItem.push(cartItem._id);
  cart.totalPrice += cartItem.totalPrice;
  cart.totalItems = cart.cartItem.length;

  const updatedCart = await cart.save();

  res.status(StatusCodes.CREATED).json({ updatedCart });
};
const removeFromCart = async (req, res) => {};
const getCart = async (req, res) => {};
const deleteCart = async (req, res) => {};
const getAllCarts = async (req, res) => {};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  deleteCart,
  getAllCarts,
};
