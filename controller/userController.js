const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const allUsers = await User.find({ role: "user" }).select(
    "-password -_id -__v"
  );
  res.status(StatusCodes.OK).json({ allUsers });
};
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select(
    "-password -_id -__v"
  );
  if (!user)
    throw new NotFoundError(`No user found with id : ${req.params.id}`);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
  res.send("getAllUsers");
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new BadRequestError("Please provide old password and new password");

  if (oldPassword === newPassword)
    throw new BadRequestError(
      "New password must be different from current password"
    );

  const user = await User.findOne({ _id: req.user.id });

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new UnauthenticatedError("Incorrect old password");
  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
