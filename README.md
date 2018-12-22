# fashioncloud-cachingserver
A simple caching server created with Node.js, ExpressJS an MongoDB.

### How do I get set up? ###

* Clone the repo to your local machine.
* Dependencies: nodejs v6.4.x+, npm v 5.5.x
* Open terminal run 'npm install'
* Create .env file with the required values. (See Creating .env file)
* run tests with command "npm test"
* run the server with command "npm start"

```bash
# clone repository
git clone https://github.com/dev-z/fashioncloud-cachingserver.git

# cd to project directory
cd fashioncloud-cachingserver

# create .env file in the root folder

# install dependencies
npm install

# run server at localhost:8001 
# or whichever port is specified in .env file
npm start
```

### Creating .env file ###

This project uses "dotenv" npm package to store and use enviroment variables.
Create a .env file in the root folder. Inside this file, the following variables must be declared:

* STAGE      : 'production', 'development', 'test' or 'staging'.
* PORT       : port on which to run the API server.
* DB_NAME    : Name of the database you want to connect to.
* DB_USER    : username with which to connect to the DB.
* DB_PASS    : password of the above given user.
* DB_HOST    : hostname of the server where the DB is located.
* DB_PORT    : port of the DB service.

### Linting ###

This project uses ESLint and Airbnb JS style-guide to help write standard and clean code.
To use linting, please ensure that you have dev-dependencies installed for this project.

* VS Code - Install the ESLint plugin by Dirk Baeumer.
* Manually - run the command "node node_modules/eslint/bin/eslint --ext .js server.js app".

### Running tests ###

Uses Mocha adn ChaiJS to run automated tests. You can use the results to integrate with CI/CD tools.
Run the command "npm test" to run the tests.
* Please note that running the tests clears the database, so DON'T RUN THE TESTS WHEN CONNECTED TO YOUR PRODUCTION DATABASE.

### Contribution guidelines ###
* TODO

#### Writing tests ####
* TODO

#### Code review ####
* TODO

### Who do I talk to? ###

* ishtiaque.zafar92 [at] gmail [dot] com