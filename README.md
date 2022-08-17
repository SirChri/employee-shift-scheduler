# Employee Shift Scheduler

A simple but effective employee shift scheduler based on React (react-admin) as frontend and Node (express) + PostgreSQL as backend.\\


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

