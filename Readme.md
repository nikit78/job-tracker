# Job Application Tracker (MERN)

A full-stack app to track job applications on a Kanban board, with search, filters, pagination and a stats dashboard built on MongoDB aggregation.

**Live demo:** `<add link after deployment>`
**Backend API:** `<add link after deployment>`

## Features

- User registration and login with JWT authentication and bcrypt password hashing
- Create, view, update and delete job applications (each user only sees their own data)
- Kanban board with drag and drop: Applied, Interview, Offer, Rejected
- Search, status filter, sorting and server-side pagination
- Notes timeline inside each application (embedded subdocuments)
- Dashboard statistics using MongoDB aggregation pipelines (status counts, applications per month)
- Request validation with Zod and a central error handler
- Loading, error and empty states in the UI

> Edit this list at the end so it only contains features that are actually finished.

## Tech Stack

- **MongoDB** (Atlas) with Mongoose
- **Express.js** and **Node.js**
- **React.js** (Vite), React Router, Context API, Axios
- JWT, bcryptjs, Zod, Helmet, CORS

## Project Structure

```
job-tracker/
├── client/          # React app (Vite)
└── server/
    ├── config/      # database connection
    ├── controllers/
    ├── middleware/  # auth, error handler
    ├── models/
    ├── routes/
    └── server.js
```

## Setup and Installation

Prerequisites: Node.js 20+, Git, and a MongoDB Atlas cluster (or local MongoDB).

```bash
git clone <repo-url>
cd job-tracker

# backend
cd server
npm install
cp .env.example .env     # on Windows: copy .env.example .env
# then open .env and fill in the values

# frontend
cd ../client
npm install
```

### Environment variables (`server/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
```

## How to Run

Run each in a separate terminal:

```bash
# backend (http://localhost:5000)
cd server
npm run dev

# frontend (http://localhost:5173)
cd client
npm run dev
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user (protected) |
| GET | `/api/applications` | List with search, filter, sort, pagination |
| POST | `/api/applications` | Create application |
| GET/PUT/DELETE | `/api/applications/:id` | Read, update, delete one |

## AI Tool Used

**Code0 (CodeZero)** in VS Code, running on `<agent name, e.g. GitHub Copilot CLI>`.

## AI Development Experience

`<Write 3 to 5 sentences in your own words: how you planned the work, how you broke it into small prompts, and how you reviewed and corrected the AI output.>`

Specific tasks where I used Code0:

1. **`<Component development>`:** `<what you asked, what you changed>`
2. **`<API creation>`:** `<...>`
3. **`<Debugging>`:** `<which bug, how you found and fixed it>`
4. **`<Database integration / aggregation>`:** `<...>`
5. **`<Refactoring or testing>`:** `<...>`

A detailed log with prompts, AI mistakes and my fixes is in [AI_LOG.md](./AI_LOG.md).

## Challenges Faced

See the "Challenges Faced" section in [AI_LOG.md](./AI_LOG.md).

## Future Improvements

- Email reminders for upcoming interviews
- Automated tests for all endpoints
- File upload for resumes