const { UnauthenticatedError } = require("../errors");
const UnauthorizedError = require("../errors/unauthorized");
const { isJWTValid } = require("../utils/index");

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer "))
    throw new UnauthenticatedError("Invalid Authentication");

  const token = authorization.split(" ")[1];
  try {
    const { firstName, lastName, email, role, id } = isJWTValid(token);
    req.user = {
      firstName,
      lastName,
      email,
      role,
      id,
    };
    next();
  } catch (err) {
    throw new UnauthenticatedError("Invalid Authentication");
  }
};

const verifyAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    throw new UnauthorizedError(
      "You don't have enough permission to access this resource"
    );
  next();
};

module.exports = { authenticateUser, verifyAdmin };
