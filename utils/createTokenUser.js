const createTokenUser = (user) => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    id: user._id,
  };
};

module.exports = createTokenUser;
