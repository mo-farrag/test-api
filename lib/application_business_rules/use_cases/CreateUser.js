"use strict";

const User = require("../../enterprise_business_rules/entities/User");
const CreatedUser = require("../../enterprise_business_rules/entities/CreatedUser");
const validateUser = require("./validators/validateUser");

module.exports = async (user, { userRepository }) => {
  const { errors, isValid } = await validateUser(user, {
    userRepository,
  });
  let userResult = {};
  if (isValid) {
    const createdUser = await userRepository.create(user);

    userResult = new CreatedUser(
      createdUser.id,
      createdUser.firstName,
      createdUser.lastName,
      createdUser.phone,
      createdUser.email
    );
  }

  return { errors, isValid, userResult };
};
