"use strict";

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};
Date.prototype.addMinutes = function (m) {
  this.setMinutes(this.getMinutes() + m);
  return this;
};

module.exports = async (
  email,
  password,
  { accessTokenManager, userRepository }
) => {
  const user = await userRepository.getByEmail(email);

  if (!user || user.password !== password) {
    throw new Error("Bad credentials");
  }

  var token = accessTokenManager.generate({
    uid: user.id,
    email: email,
    expireAt: new Date().addHours(1),
  });

  return token;
};
