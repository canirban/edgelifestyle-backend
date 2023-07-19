const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const { createJWT } = require("../utils");
const createTokenUser = require("../utils/createTokenUser");
const register = async (req, res) => {
  const userDetails = req.body;
  const { email } = userDetails;
  const isExistingUser = await User.findOne({ email });
  if (isExistingUser)
    throw new BadRequestError(`User with email ${email} already exist`);
  userDetails.verificationToken = crypto.randomBytes(40).toString("hex");
  const createdUser = await User.create(userDetails);
  const { password, __v, ...user } = createdUser._doc;
  //   attachCookiesToResponse(res, tokenDetails);
  // user.token = createJWT(createTokenUser(createdUser));
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Please provide email & password");

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Invalid credentials");
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid credentials");

  if (!user.isVerified)
    throw new UnauthenticatedError("Please verify your email");

  user.token = createJWT(createTokenUser(user));
  res.status(StatusCodes.OK).json({ user });
};

const logout = async (req, res) => {
  //   res.cookie("token", "", { httpOnly: true, expires: new Date(Date.now()) });
  //   res.status(StatusCodes.OK).json({ msg: "Logout successful" });
  res.status(StatusCodes.OK).send("logout");
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Failed to verify user");

  if (user.verificationToken !== verificationToken)
    throw new UnauthenticatedError("Failed to verify user");

  await User.findOneAndUpdate(
    { _id: user._id },
    { verificationToken: "", isVerified: true, verified: Date.now() }
  );

  res.status(StatusCodes.OK).json(`User with email : ${email} is verified`);
};

module.exports = { register, login, verifyEmail };
