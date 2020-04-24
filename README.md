# Users API - Node.js

## Getting started

1. install dependencies (Built with Node.js)

```sh
cd users-api-nodejs/
npm install
```

2. run migrations and seeders

```sh
node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all
```

3. run unit tests

```sh
npm run test
```

4. start express server

```
npm run start
```

## Endpoints description

samples of API's requests via Postman is attached.

this is an API that has the below endpoints:
1- register: to allow registering users by passing (firstName, LastName, phone, email and passowrd), and validate them them add it to a sqlite database

2-login: to allow user to login with email and password, and return a JWT token(expires after 1 hour) to use to access secured endpoint

3- check: this is just a private route for authorized users only, I did'nt understand why to have a logout endpoint on the server as we are validating the JWT token on each reach using the 'Authenticate.js' middleware, that check if the token is correct and not expired yet to.
thats why I ignored the loutout endpoint and replace it with the 'check' endpoint to just check that the secure route is working as expected.

## DDD and Clean Architecture

The application follows the Uncle Bob "[Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)", this way allow us to seperate layers off each other and make it easy to update layers and write unit tests that tests each layer.

principles and project structure :

### Clean Architecture layers

![Schema of flow of Clean Architecture](/doc/Uncle_Bob_Clean_Architecture.jpg)

### Flow of Control

![Schema of flow of Control](/doc/Hapijs_Clean_Architecture.svg)
