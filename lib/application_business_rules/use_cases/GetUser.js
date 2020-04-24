"use strict";

const User = require("../../enterprise_business_rules/entities/User");
const CreatedUser = require("../../enterprise_business_rules/entities/CreatedUser");

module.exports = async (user, { userRepository }) => {
  let userResult = {};
  if (isValid) {
    const user = await userRepository.getByEmail(user.email);

    userResult = new CreatedUser(
      user.id,
      user.firstName,
      user.lastName,
      user.phone
    );
  }

  return { errors, isValid, userResult };
};
