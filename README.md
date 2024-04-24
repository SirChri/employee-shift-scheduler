# Employee Shift Scheduler
![Home screen](docs/images/home-calendar.png?raw=true "Home screen")
A (very) simple but effective employee shift scheduler based on React (react-admin) as frontend and Java (SpringBoot) + PostgreSQL as backend.<br>

# Main Features
- Manage and store Users who can authenticate to and use the platform (no permissions handled yet);
- Manage and store Employees who work for a specific customer at a time;
- Manage and store Customers;
- Event report:
![Event report](docs/images/event-report.png?raw=true "Event report")

# Requirements
## Docker version
- Just Docker

## Non-Docker version
- PostgreSQL (tested with v14, but should be ok with others as well)
- Apache Tomcat 

# Quick setup
## Docker version
I already bundled a docker-compose configuration file in order to quickly launch the application with the simple command: `docker-compose up --build`.

## Standard version
You can build the *war* file with the simple `mvn clean package` command.<br>
**IMPORTANT**: on you psql instance there must exists the db you want to use as app db. Necessary tables will be created automatically by sequilize.

# Under the hood
- frontend is written in React with typescript and is based on [https://marmelab.com/react-admin/](react-admin)
- backend is written in Java with SpringBoot
- Calendar is entirely based on [https://fullcalendar.io/](fullcalendar) library;
- all requests to the server require authentication;

## ER Diagram
![ER diagram](docs/images/er.png?raw=true "Entity-Relationship Diagram")

# TODOs
- handle constraints, such as:
  - no overlaps between different agenda entries for the same employee
  - dynamically handle "exclusion" date-time slots in agenda entry creation or update (e.g. exclude weekends);
  - end date must be greater than begin date in agenda entry creation or update;
- handle bulk updates/inserts
- handle agenda entry clone action
- improve documentation and readme