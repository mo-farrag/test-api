"use strict";

const express = require("express");
const router = express.Router();
const CreateUser = require("../../../application_business_rules/use_cases/CreateUser");
const User = require("../../../enterprise_business_rules/entities/User");
const UserRepository = require("../../../application_business_rules/repositories/UserRepository");
const userRepository = new UserRepository();
const JwtAccessTokenManager = require("../../security/JwtAccessTokenManager");
const GetAccessToken = require("../../../application_business_rules/use_cases/GetAccessToken");

const authenticate = require("../authenticate");

//@route    POST/api/users/register
//@desc     register users route
//@access   public
router.post("/register", async (req, res) => {
  // Input
  const { firstName, lastName, phone, email, password } = req.body;

  const user = new User(null, firstName, lastName, phone, email, password);

  // Treatment
  const { errors, isValid, userResult } = await CreateUser(user, {
    userRepository,
  });

  if (!isValid) return res.status(400).json(errors);

  return res.status(200).json(userResult);
});

//@route    POST/api/users/login
//@desc     login users route
//@access   public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const accessTokenManager = new JwtAccessTokenManager();

  try {
    const accessToken = await GetAccessToken(email, password, {
      accessTokenManager,
      userRepository,
    });

    return res.status(200).json(accessToken);
  } catch (err) {
    return res.status(403).json("Bad credentials");
  }
});

//@route    POST/api/users/check
//@desc     check user is authorized
//@access   private
router.post("/check", authenticate, async (req, res) => {
  res
    .status(200)
    .send(`Hi, your email: ${req.body.user.email}, request is authorized!`);
});

module.exports = router;
