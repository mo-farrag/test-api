const UserRepository = require("../../../lib/application_business_rules/repositories/UserRepository");
const mockUserRepository = new UserRepository();
const User = require("../../../lib/enterprise_business_rules/entities/User");

const AccessTokenManager = require("../../../lib/application_business_rules/security/AccessTokenManager");
const MockAccessTokenManager = class extends AccessTokenManager {};
const mockAccessTokenManager = new MockAccessTokenManager();

const GetAccessToken = require("../../../lib/application_business_rules/use_cases/GetAccessToken");

test("should resolve with a generated JWT access token when credentials are ok", async () => {
  // given
  const existedUser = new User(
    123,
    "John",
    "Doe",
    "0123456789123",
    "john@mail.com",
    "abcd-1234"
  );
  mockUserRepository.getByPhone = jest.fn(() => existedUser);
  mockUserRepository.getByEmail = jest.fn(() => existedUser);
  mockAccessTokenManager.generate = () => "generated-jwt-access-token";

  // when
  const accessToken = await GetAccessToken("0123456789123", "abcd-1234", {
    accessTokenManager: mockAccessTokenManager,
    userRepository: mockUserRepository,
  });

  // then
  expect(accessToken).toBe("generated-jwt-access-token");
});

test("should reject when user was not found", () => {
  // given
  mockUserRepository.getByPhone = () => null;
  mockUserRepository.getByEmail = () => null;

  // when
  const promise = GetAccessToken("0123456789123", "abcd-1234", {
    accessTokenManager: mockAccessTokenManager,
    userRepository: mockUserRepository,
  });

  // then
  return expect(promise).rejects.toThrow("Bad credentials");
});

test("should reject when password did not match", () => {
  // given
  const existedUser = new User(
    123,
    "John",
    "Doe",
    "0123456789123",
    "john@mail.com",
    "abcd-1234"
  );
  mockUserRepository.getByPhone = jest.fn(() => existedUser);
  mockUserRepository.getByEmail = jest.fn(() => existedUser);

  // when
  const promise = GetAccessToken("0123456789123", "wrong-password", {
    accessTokenManager: mockAccessTokenManager,
    userRepository: mockUserRepository,
  });

  // then
  return expect(promise).rejects.toThrow("Bad credentials");
});
