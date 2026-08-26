# EventPulse API

A RESTful backend API for managing events, user registrations, and event announcements.

## Tech Stack

* Node.js
* Express.js
* MongoDB & Mongoose
* Socket.io
* Jest
* Supertest

## Project Structure

```text
EYOUTH-30803030200829-EventPulse/

├── config/
│   ├── db.js
│   └── swagger.js
├── controllers/
│   ├── announcementController.js
│   ├── authController.js
│   ├── eventController.js
│   └── registrationController.js
├── middleware/
│   ├── errorHandler.js
│   ├── requireAuth.js
│   ├── requireRole.js
│   └── validate.js
├── models/
│   ├── Category.js
│   ├── Event.js
│   ├── Message.js
│   ├── Registration.js
│   └── User.js
├── routes/
│   ├── announcementRoutes.js
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── registrationRoutes.js
├── utils/
├── tests/
│   ├── unit/
│   │   ├── AppError.test.js
│   │   └── asyncHandler.test.js
│   └── integration/
│       └── events.test.js
├── postman/
│   └── EventPulse.postman_collection.json
├── app.js
├── node_modules
├── seed.js
├── jest.config.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── vercel.json
└── README.md
```

## Local Installation

1. Clone the repository:

```bash
git clone https://github.com/NonaMoharram/EventPulse.git
cd EventPulse
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and configure the required environment variables.

4. Seed the database:

```bash
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

## API Endpoint Summary

| Method | Endpoint                      | Description                                                |
| ------ | ----------------------------- | ---------------------------------------------------------- |
| POST   | `/api/auth/register`          | Register a new user                                        |
| POST   | `/api/auth/login`             | Login and receive a JWT token                              |
| GET    | `/api/events`                 | List events with filtering, pagination, sorting and search |
| GET    | `/api/events/:id`             | Get a single event                                         |
| POST   | `/api/events`                 | Create an event                                            |
| PATCH  | `/api/events/:id`             | Update an event                                            |
| DELETE | `/api/events/:id`             | Delete an event                                            |
| POST   | `/api/registrations`          | Register for an event                                      |
| GET    | `/api/registrations/my`       | Get the current user's registrations                       |
| DELETE | `/api/registrations/:id`      | Cancel a registration                                      |
| POST   | `/api/announcements`          | Create an event announcement                               |
| GET    | `/api/announcements/:eventId` | Get announcement history                                   |
| GET    | `/health`                     | Check server and database status                           |

## Testing

Run the automated test suite:

```bash
npm test
```

Tests are implemented using Jest and Supertest and include unit and integration tests.

## Live Deployment Link

https://event-pulse-theta.vercel.app
