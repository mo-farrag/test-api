"use strict";

const db = require("../../frameworks_drivers/database/models");
const User = require("../../enterprise_business_rules/entities/User");

module.exports = class {
  constructor() {}
  create(user) {
    const { firstName, lastName, phone, email, password } = user;

    return db.users.create({
      firstName,
      lastName,
      phone,
      email,
      password,
    });
  }

  getByPhone(phone) {
    return db.users.findOne({ where: { phone: phone } });
  }

  getByEmail(email) {
    return db.users.findOne({ where: { email: email } });
  }

  getById(id) {
    return db.users.findOne({ where: { id: id } });
  }
};
