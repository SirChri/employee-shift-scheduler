# Employee Shift Scheduler
![Home screen](docs/images/home.png?raw=true "Home screen")
A (very) simple but effective employee shift scheduler based on React (react-admin) as frontend and Node (express) + PostgreSQL as backend.\\

# Main Features
- Manage and store Users who can authenticate to and use the platform (no permissions handled yet);
- Manage and store Employees who work for a specific customer at a time;
- Manage and store Customers;

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