# Issue Tracker

A full-stack **Issue Tracker** application built as part of the **freeCodeCamp Quality Assurance Certification**. The application allows users to create, view, update, filter, and delete issues for different projects through a RESTful API.

## Features

- Create issues with required and optional fields
- View all issues for a project
- Filter issues using one or more query parameters
- Update one or multiple fields of an existing issue
- Delete issues by ID
- Automatic timestamps (`created_on` and `updated_on`)
- Functional API tests using Mocha and Chai

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Mocha
- Chai
- Chai HTTP
- Body Parser
- CORS
- dotenv

## Project Structure

```text
.
├── models/
│   └── models.js
├── public/
│   └── controllers/
│       └── issueControllers.js
├── routes/
│   ├── api.js
│   └── fcctesting.js
├── tests/
│   └── 2_functional-tests.js
├── utils/
│   └── helpers.js
├── views/
├── server.js
├── package.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Ahmedkhan78/fcc-issueTracker.git
```

Move into the project directory:

```bash
cd fcc-issueTracker
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and add:

```env
DB=your_mongodb_connection_string
PORT=3000
NODE_ENV=test
```

Start the server:

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

## API Endpoints

### Create Issue

**POST**

```http
/api/issues/:project
```

Example request body:

```json
{
  "issue_title": "Login Bug",
  "issue_text": "Unable to login",
  "created_by": "Ahmed",
  "assigned_to": "Developer",
  "status_text": "In Progress"
}
```

---

### View Issues

**GET**

```http
/api/issues/:project
```

Filter examples:

```http
/api/issues/test
```

```http
/api/issues/test?open=true
```

```http
/api/issues/test?created_by=Ahmed&open=true
```

---

### Update Issue

**PUT**

```http
/api/issues/:project
```

Example:

```json
{
  "_id": "issue_id",
  "issue_text": "Updated issue description"
}
```

---

### Delete Issue

**DELETE**

```http
/api/issues/:project
```

Example:

```json
{
  "_id": "issue_id"
}
```

## Running Tests

Run all functional tests:

```bash
npm test
```

Or enable automatic testing by setting:

```env
NODE_ENV=test
```

## Project Requirements

- Create issues
- Read issues
- Update issues
- Delete issues
- Filter issues with query parameters
- Handle missing or invalid data gracefully
- Return proper JSON responses

## Repository

GitHub Repository:

https://github.com/Ahmedkhan78/fcc-issueTracker

## License

This project was created for educational purposes as part of the freeCodeCamp Quality Assurance Certification.
