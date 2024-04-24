# Shift Scheduler

![Home screen](docs/images/home-calendar.png?raw=true "Home screen")

A straightforward and efficient employee shift scheduler featuring a React frontend and a Java (Spring Boot) backend with PostgreSQL. This application allows you to manage employee schedules and other related entities.

## Key Features
- **User Management**: Manage and store users who can authenticate and use the platform (no permissions handling yet).
- **Employee Management**: Manage and store employee records for specific customers.
- **Customer Management**: Handle customer records and related data.
- **Event Management**: Create, manage, and schedule events, including recurring events following the iCalendar standard.
- **Event Reporting**: Generate event reports with ease.
![Event report](docs/images/event-report.png?raw=true "Event report")

## Requirements

### Docker Version
- Docker is the only requirement.

### Non-Docker Version
- PostgreSQL (tested with v14, but likely compatible with other versions).
- Apache Tomcat.

## Quick Setup

The default admin user for both versions is `admin:admin`. Change the password within the application for better security.

### Docker Version
Launch the application quickly using the provided `docker-compose.yml` file with the command: `docker-compose up --build`. Customize the `.env` file as needed.

### Non-Docker Version
- Download the latest `war` file from Releases
- Download the latest apache-tomcat software
- Put the `war` file inside the tomcat webapps folder
- Configure the `WEB-INF/classes/application.properties` as you wish
- Start tomcat

**Note**: Make sure the target database exists in your PostgreSQL instance; the required tables will be automatically created.

## Technology Stack

- **Frontend**: Built using React with TypeScript, based on [react-admin](https://marmelab.com/react-admin/).
- **Backend**: Developed with Java and Spring Boot.
- **Calendar**: Utilizes the [fullcalendar](https://fullcalendar.io/) library.
- **Security**: All server requests require authentication.

## Entity-Relationship Diagram
![ER diagram](docs/images/er.png?raw=true "Entity-Relationship Diagram")

## Future Improvements

- Enforce constraints such as:
  - Preventing schedule overlaps for the same employee.
  - Dynamic handling of exclusion date-time slots during schedule creation or updates (e.g., exclude weekends).
  - Ensuring end dates are later than start dates during schedule creation or updates.
- Handle bulk updates and inserts.
- Implement an entry clone action for schedules.
- Enhance documentation and README.
