"use strict";

module.exports = (accessToken, email, { accessTokenManager }) => {
  const decoded = accessTokenManager.decode(accessToken);
  if (!decoded) {
    return { isValid: false, user: {}, tokenStatus: "invalid" };
  }

  if (decoded.email !== email)
    return { isValid: false, user: {}, tokenStatus: "invalid" };

  if (new Date(decoded.expireAt) > new Date())
    return { isValid: true, user: decoded, tokenStatus: "valid" };
  else return { isValid: false, user: {}, tokenStatus: "expired" };
};
