const AccessTokenManager = require("../../../lib/application_business_rules/security/AccessTokenManager");
const mockAccessTokenManager = new AccessTokenManager();
const VerifyAccessToken = require("../../../lib/application_business_rules/use_cases/VerifyAccessToken");

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

test("should resolve with the decoded user data when OAuth JWT access token is valid", async () => {
  // given
  const decodedData = {
    uid: 1234,
    phone: "0123456789123",
    email: "john@mail.com",
    expireAt: new Date().addHours(1),
  };
  mockAccessTokenManager.decode = () => {
    return decodedData;
  };

  // when
  const { isValid, user, tokenStatus } = await VerifyAccessToken(
    "some-jwt-access-token",
    "john@mail.com",
    {
      accessTokenManager: mockAccessTokenManager,
    }
  );

  // then
  expect(tokenStatus).toEqual("valid");
  expect(isValid).toEqual(true);
  expect(user).toEqual(decodedData);
});

test("should resolve with the decoded user data when OAuth JWT access token is expired", async () => {
  // given
  mockAccessTokenManager.decode = () => {
    return {
      uid: 1234,
      phone: "0123456789123",
      email: "john@mail.com",
      expireAt: new Date().addHours(-1),
    };
  };

  // when
  const { isValid, user, tokenStatus } = await VerifyAccessToken(
    "some-jwt-access-token",
    "john@mail.com",
    {
      accessTokenManager: mockAccessTokenManager,
    }
  );

  // then
  expect(isValid).toEqual(false);
  expect(tokenStatus).toEqual("expired");
  expect(user).toEqual({});
});

test("should reject with 'invalid' when OAuth JWT access token is invalid", () => {
  // given
  mockAccessTokenManager.decode = () => null;

  // when
  const { isValid, user, tokenStatus } = VerifyAccessToken(
    "a-wrong-jwt-access-token",
    "0123456789123",
    {
      accessTokenManager: mockAccessTokenManager,
    }
  );
  expect(isValid).toEqual(false);
  expect(tokenStatus).toEqual("invalid");
  expect(user).toEqual({});
});

test("should reject with 'invalid' when email is not that same as in OAuth JWT access token", () => {
  //given
  mockAccessTokenManager.decode = () => {
    return {
      uid: 1234,
      phone: "0123456000000",
      expireAt: new Date().addHours(-1),
    };
  };

  // when
  const { isValid, user, tokenStatus } = VerifyAccessToken(
    "some-jwt-access-token",
    "0123456789123",
    {
      accessTokenManager: mockAccessTokenManager,
    }
  );

  expect(isValid).toEqual(false);
  expect(tokenStatus).toEqual("invalid");
  expect(user).toEqual({});
});
