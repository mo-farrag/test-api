"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "Snoop",
          lastName: "Dog",
          phone: "11122223333",
          email: "snoopydog@dogpound.com",
          password: "123456",
          createdAt: "2019-11-11",
          updatedAt: "2019-11-11",
        },
        {
          firstName: "Scooby",
          lastName: "Doo",
          phone: "44455556666",
          email: "scooby.doo@misterymachine.com",
          password: "123456",
          createdAt: "2019-11-11",
          updatedAt: "2019-11-11",
        },
        {
          firstName: "Herbie",
          lastName: "Husker",
          phone: "40243770001",
          email: "herbie.husker@unl.edu",
          password: "123456",
          createdAt: "2019-11-11",
          updatedAt: "2019-11-11",
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
