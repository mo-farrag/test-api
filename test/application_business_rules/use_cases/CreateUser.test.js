const User = require("../../../lib/enterprise_business_rules/entities/User");
const CreatedUser = require("../../../lib/enterprise_business_rules/entities/CreatedUser");
const UserRepository = require("../../../lib/application_business_rules/repositories/UserRepository");
const mockUserRepository = new UserRepository();
const CreateUser = require("../../../lib/application_business_rules/use_cases/CreateUser");

test("should create new user successfully", async () => {
  // given
  const createdUser = new CreatedUser(
    123,
    "John",
    "Doe",
    "0123456789123",
    "john@mail.com",
    "2000-01-01"
  );

  const inputUser = new User(
    null,
    "John",
    "Doe",
    "0123456789123",
    "john@mail.com",
    "123456"
  );

  mockUserRepository.getByPhone = () => null;
  mockUserRepository.getByEmail = () => null;
  mockUserRepository.create = jest.fn(() => createdUser);

  // when
  const { isValid, errors, userResult } = await CreateUser(inputUser, {
    userRepository: mockUserRepository,
  });

  // then
  expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser);
  expect(isValid).toEqual(true);
  expect(errors).toEqual({});
  expect(userResult).toEqual(createdUser);
});

test("should reject creating new user, missing required fields", async () => {
  // given
  const inputUser = new User(null, "", "", "", "", "");
  mockUserRepository.create = jest.fn(() => null);

  // when
  const { isValid, errors, userResult } = await CreateUser(inputUser, {
    UserRepository: mockUserRepository,
  });

  // then
  expect(isValid).toEqual(false);
  expect(errors.firstName).toContain("First name is required");
  expect(errors.lastName).toContain("Last name is required");
  expect(errors.phone).toContain("Phone is required");
  expect(errors.password).toContain("Password is required");
  expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
  expect(userResult).toEqual({});
});

test("should reject creating new user, phone is taken", async () => {
  // given
  const existedUser = new User(
    123,
    "John",
    "Doe",
    "0123456789123",
    "john@mail.com",
    "2000-01-01"
  );

  const inputUser = new User(
    null,
    "John",
    "Doe",
    "0123456789123",
    "john@mail.com",
    "123456"
  );

  mockUserRepository.getByPhone = jest.fn(() => existedUser);
  mockUserRepository.getByEmail = jest.fn(() => null);
  mockUserRepository.create = jest.fn(() => createdUser);

  // when
  const { isValid, errors, userResult } = await CreateUser(inputUser, {
    userRepository: mockUserRepository,
  });

  // then
  expect(errors.phone).toEqual("phone is taken");
  expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
  expect(isValid).toEqual(false);
  expect(userResult).toEqual({});
});

test("should reject creating new user, phone is not a number", async () => {
  // given
  const inputUser = new User(
    null,
    "John",
    "Doe",
    "wrong-phone",
    "john@mail.com",
    "123456"
  );

  mockUserRepository.getByPhone = jest.fn(() => null);
  mockUserRepository.getByEmail = jest.fn(() => null);
  mockUserRepository.create = jest.fn(() => createdUser);

  // when
  const { isValid, errors, userResult } = await CreateUser(inputUser, {
    userRepository: mockUserRepository,
  });

  // then
  expect(errors.phone).toEqual("not a number");
  expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
  expect(isValid).toEqual(false);
  expect(userResult).toEqual({});
});

test("should reject creating new user, phone is too short", async () => {
  // given
  const inputUser = new User(
    null,
    "John",
    "Doe",
    "012345",
    "john@mail.com",
    "123456"
  );

  mockUserRepository.getByPhone = jest.fn(() => null);
  mockUserRepository.getByEmail = jest.fn(() => null);
  mockUserRepository.create = jest.fn(() => createdUser);

  // when
  const { isValid, errors, userResult } = await CreateUser(inputUser, {
    userRepository: mockUserRepository,
  });

  // then
  expect(errors.phone).toEqual("too short, length should be between 11 and 14");
  expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
  expect(isValid).toEqual(false);
  expect(userResult).toEqual({});
});

test("should reject creating new user, phone is too long", async () => {
  // given
  const inputUser = new User(
    null,
    "John",
    "Doe",
    "01234567891230000",
    "john@mail.com",
    "123456"
  );

  mockUserRepository.getByPhone = jest.fn(() => null);
  mockUserRepository.getByEmail = jest.fn(() => null);
  mockUserRepository.create = jest.fn(() => createdUser);

  // when
  const { isValid, errors, userResult } = await CreateUser(inputUser, {
    userRepository: mockUserRepository,
  });

  // then
  expect(errors.phone).toEqual("too long, length should be between 11 and 14");
  expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
  expect(isValid).toEqual(false);
  expect(userResult).toEqual({});
});

test("should reject creating new user, email is taken", async () => {
  // given
  const existedUser = new User(
    123,
    "John",
    "Doe",
    "0123456789123",
    "john@mail.com",
    "2000-01-01"
  );

  const inputUser = new User(
    null,
    "John",
    "Doe",
    "0123456789123",
    "john@mail.com",
    "123456"
  );

  mockUserRepository.getByPhone = jest.fn(() => null);
  mockUserRepository.getByEmail = jest.fn(() => existedUser);
  mockUserRepository.create = jest.fn(() => createdUser);

  // when
  const { isValid, errors, userResult } = await CreateUser(inputUser, {
    userRepository: mockUserRepository,
  });

  // then
  expect(errors.email).toEqual("email is taken");
  expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
  expect(isValid).toEqual(false);
  expect(userResult).toEqual({});
});

test("should reject creating new user, invalid email", async () => {
  // given
  const inputUser = new User(
    null,
    "John",
    "Doe",
    "0123456789123",
    "wrong-email",
    "123456"
  );

  mockUserRepository.getByPhone = jest.fn(() => null);
  mockUserRepository.getByEmail = jest.fn(() => null);
  mockUserRepository.create = jest.fn(() => createdUser);

  // when
  const { isValid, errors, userResult } = await CreateUser(inputUser, {
    userRepository: mockUserRepository,
  });

  // then
  expect(errors.email).toEqual("invalid");
  expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
  expect(isValid).toEqual(false);
  expect(userResult).toEqual({});
});
