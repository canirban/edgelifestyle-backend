const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const User = require("../models/User");
const { createJWT, checkPermission } = require("../utils");
const createTokenUser = require("../utils/createTokenUser");

const getAllUsers = async (req, res) => {
  const allUsers = await User.find({ role: "user" }).select(
    "-password -_id -__v"
  );
  res.status(StatusCodes.OK).json({ allUsers });
};
const getSingleUser = async (req, res) => {
  console.log(req.user, typeof req.params.id);
  checkPermission(req.user, req.params.id);
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
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName)
    throw new BadRequestError("Please provide firstName, lastName");

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { firstName, lastName },
    { new: true, runValidators: true }
  );
  if (!user) throw new NotFoundError("No user found");
  const token = createJWT(createTokenUser(user));
  console.log(token);
  const { password, _id, __v, ...updatedUser } = user._doc;
  updatedUser.token = token;
  res.status(StatusCodes.OK).json({ updatedUser });
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
