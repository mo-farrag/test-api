"use strict";

module.exports = class {
  constructor(id = null, firstName, lastName, phone, email, password) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.password = password;
  }
};
