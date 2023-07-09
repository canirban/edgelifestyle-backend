const createTokenUser = (user) => {
  return {
    name: user.firstName.concat(" ", user.lastName),
    email,
    role: user.role,
    id: user._id,
  };
};

module.exports = createTokenUser;
