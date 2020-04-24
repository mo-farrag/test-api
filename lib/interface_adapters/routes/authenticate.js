const keys = require("../../../config/keys");
const UserRepository = require("../../application_business_rules/repositories/UserRepository");
const userRepository = new UserRepository();
const JwtAccessTokenManager = require("../security/JwtAccessTokenManager");
const VerifyAccessToken = require("../../application_business_rules/use_cases/VerifyAccessToken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const accessTokenManager = new JwtAccessTokenManager();
  try {
    const { isValid, user, tokenStatus } = VerifyAccessToken(
      token,
      req.body.email,
      {
        accessTokenManager,
        userRepository,
      }
    );

    if (!isValid) {
      if (tokenStatus === "invalid") {
        res.status(401).json({ error: "Invalid request!" });
      } else if (tokenStatus === "expired") {
        res.status(401).json({ error: "token is expired" });
      }
    } else {
      req.body.user = user;
      next();
    }
  } catch {
    res.status(401).json({
      error: "Invalid request !",
    });
  }
};
