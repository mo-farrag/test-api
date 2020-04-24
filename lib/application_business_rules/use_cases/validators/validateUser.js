"use strict";

const validator = require("email-validator");
const validatePhoneNumber = require("validate-phone-number-node-js");
const isEmpty = require("./is-empty");

module.exports = async (user, { userRepository }) => {
  var errors = {};

  if (user.firstName == "") errors.firstName = "First name is required";

  if (user.lastName == "") errors.lastName = "Last name is required";

  if (user.phone == "") errors.phone = "Phone is required";
  else {
    if (user.phone.length < 11)
      errors.phone = "too short, length should be between 11 and 14";
    else if (user.phone.length > 14)
      errors.phone = "too long, length should be between 11 and 14";
    else if (!validatePhoneNumber.validate(user.phone))
      errors.phone = "not a number";
    else {
      var obj = await userRepository.getByPhone(user.phone);
      if (obj) errors.phone = "phone is taken";
    }
  }

  if (user.email != "") {
    if (!validator.validate(user.email)) errors.email = "invalid";
    else {
      const obj = await userRepository.getByEmail(user.email);
      if (obj) errors.email = "email is taken";
    }
  }

  if (user.password == "") errors.password = "Password is required";

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
