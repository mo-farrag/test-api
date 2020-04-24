"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const users = require("./lib/interface_adapters/routes/api/users");
//const sequelize = require("./lib/frameworks_drivers/database/sequelize");
const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server running on port ${port}`));

module.exports = app;
