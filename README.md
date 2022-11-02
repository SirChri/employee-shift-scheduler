# Employee Shift Scheduler
![Home screen](docs/images/home.png?raw=true "Home screen")
A (very) simple but effective employee shift scheduler based on React (react-admin) as frontend and Node (express) + PostgreSQL as backend.<br>

# Main Features
- Manage and store Users who can authenticate to and use the platform (no permissions handled yet);
- Manage and store Employees who work for a specific customer at a time;
- Manage and store Customers;

# Requirements
## Docker version
- Just Docker

## Non-Docker version
- PostgreSQL (tested with v14, but should be ok with others as well)
- NodeJS

# Quick setup
## Docker version
I already bundled a docker-compose configuration file in order to quickly launch the application with the simple command: `docker-compose up --build`. Default (client) app will start on port 8888, psql database on port 5436 and the server on port 6868.

## Standard version
You can easily build the (react) app with the standard react command `npm run build` once you are inside the *client* folder. <br>
Server is just a simple node app and so can be started with `npm run start` inside the *server* folder.<br>
You can customize the env variables by changing the `.env` file.<br>
**IMPORTANT**: on you psql instance there must exists the db you want to use as app db. Necessary tables will be created automatically by sequilize.

# Under the hood
- frontend is written in React with typescript and is based on [https://marmelab.com/react-admin/](react-admin)
- backend is written in javascript and uses [https://expressjs.com/](express) to handle REST requests and [https://sequelize.org/](sequelize) to fetch/handle data from PostgreSQL instance;
- Authentication is brought by [https://www.passportjs.org/](passportjs) and it uses the simple (but safe) "session local strategy";
- Timeline is entirely based on [https://github.com/visjs/vis-timeline](vis-timeline) library;
- all requests to the server require authentication;

## ER Diagram
![ER diagram](docs/images/er.png?raw=true "Entity-Relationship Diagram")

# TODOs
- handle constraints, such as:
  - no overlaps between different agenda entries for the same employee
  - dynamically handle "exclusion" date-time slots in agenda entry creation or update (e.g. exclude weekends);
  - end date must be greater than begin date in agenda entry creation or update;
- handle recurring events
- handle bulk updates/inserts
- handle agenda entry clone action
- add reporting tools (e.g. pdf export)

# Nice to have (s)
- add filter functionalities to timeline
- improve layouts among the app