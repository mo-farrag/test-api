"use strict";

const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");

const AccessTokenManager = require("../../application_business_rules/security/AccessTokenManager");

module.exports = class extends AccessTokenManager {
  generate(payload) {
    return jwt.sign(payload, keys.secretOrKey);
  }

  decode(accessToken) {
    return jwt.verify(accessToken, keys.secretOrKey);
  }
};
