const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createJWT } = require("../utils");
const createTokenUser = require("../utils/createTokenUser");
const register = async (req, res) => {
  const userDetails = req.body;
  const { email } = userDetails;
  const isExistingUser = await User.findOne({ email });
  if (isExistingUser)
    throw new BadRequestError(`User with email ${email} already exist`);
  const createdUser = await User.create(userDetails);
  const { password, _id, __v, ...user } = createdUser._doc;
  //   attachCookiesToResponse(res, tokenDetails);
  user.token = createJWT(createTokenUser(createdUser));
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

  user.token = createJWT(createTokenUser(user));
  res.status(StatusCodes.OK).json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    token: user.token,
  });
};

const logout = async (req, res) => {
  //   res.cookie("token", "", { httpOnly: true, expires: new Date(Date.now()) });
  //   res.status(StatusCodes.OK).json({ msg: "Logout successful" });
  res.status(StatusCodes.OK).send("logout");
};

module.exports = { register, login, logout };
