const jwt = require("jsonwebtoken");

const createJWT = (tokenDetails) =>
  jwt.sign(tokenDetails, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

const isJWTValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

// const attachCookiesToResponse = (res, user) => {
//   res.cookie("token", createJWT(user), {
//     httpOnly: true,
//     expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
//     signed: true,
//   });
// };

module.exports = { createJWT, isJWTValid };
