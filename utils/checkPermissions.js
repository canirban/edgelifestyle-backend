const UnauthorizedError = require("../errors/unauthorized");

const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin" || requestUser.id === resourceUserId) return;
  throw new UnauthorizedError("Not authorized to access this route");
};
module.exports = checkPermission;
