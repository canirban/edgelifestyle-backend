const Review = require("../models/Review");
const Product = require("../models/Product");
const { NotFoundError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const UnauthorizedError = require("../errors/unauthorized");
const { checkPermission } = require("../utils");
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct)
    throw new NotFoundError(
      `The product with id : ${productId} does not exist`
    );
  const alreadySubmittedReview = await Review.findOne({
    product: productId,
    user: req.user.id,
  });
  if (alreadySubmittedReview)
    throw new BadRequestError(
      "A review already exist for this product by this user"
    );
  req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find().populate({
    path: "product",
    select: "name company",
  });
  res.status(StatusCodes.OK).json({ reviews });
};
const getSingleReview = async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) throw new NotFoundError(`No review with id : ${reviewId} found`);
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const { id: userId } = req.user;
  if (!rating || !title || !comment)
    throw new BadRequestError("Please provide rating, title and comment ");
  const { reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) throw new NotFoundError(`No review with id : ${reviewId} found`);

  if (review.user.toString() !== userId)
    throw new UnauthorizedError(
      `You don't have permission to update this review`
    );
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  const updatedReview = await review.save();
  res.status(StatusCodes.OK).json({ updatedReview });
};
const deleteReview = async (req, res) => {
  const { id: userId } = req.user;
  const { reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) throw new NotFoundError(`No review with id : ${reviewId} found`);
  if (review.user.toString() !== userId)
    throw new UnauthorizedError(
      `You don't have permission to delete this review`
    );
  await review.deleteOne();
  res
    .status(StatusCodes.OK)
    .json({ msg: `Review deleted with id : ${reviewId}` });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
