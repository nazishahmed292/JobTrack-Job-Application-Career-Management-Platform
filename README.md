# JobTrack

JobTrack is a full-stack job application and career management platform built for professionals who want to organize their search, track interviews, manage resumes, and surface job-market insights from the roles they are targeting.

## Features

- Authentication with JWT-based login and registration
- Personalized dashboard with analytics cards and charts
- Job application tracking with statuses, notes, tags, and search/filtering
- Kanban pipeline with drag-and-drop workflow management
- Interview scheduling and reminders
- Resume upload and primary resume selection
- Job description analyzer with keyword matching against profile skills
- Notifications and unread counts
- Responsive SaaS-style dashboard

## Tech Stack

### Frontend
- React + Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Recharts
- React Hook Form
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- Multer
- Helmet + CORS + rate limiting

## Architecture

The project follows a monorepo structure with separate frontend and backend packages.

- `client/` contains the React application
- `server/` contains the Express API, models, middleware, and uploads

## Project Structure

```text
JobTrack/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
├── package.json
├── .gitignore
└── .env.example
```

## Screenshots

Add screenshots here when you have product images.

## Installation

1. Clone the repository.
2. Install root dependencies:
   ```bash
   npm install
   ```
3. Configure environment files.

## Environment Variables

### Server
Create `server/.env` using `server/.env.example` with values like:

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/jobtrack
JWT_SECRET=replace-with-long-random-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client
Create `client/.env` using `client/.env.example`:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Running Frontend

```bash
npm run dev --workspace client
```

## Running Backend

```bash
npm run dev --workspace server
```

## Database Setup

Use MongoDB locally or MongoDB Atlas. For local development, start a MongoDB instance and set `MONGODB_URI` to the connection string.

## API Documentation

Core endpoints include:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/applications`
- `POST /api/applications`
- `PATCH /api/applications/:id/status`
- `GET /api/interviews`
- `POST /api/interviews`
- `GET /api/resumes`
- `POST /api/resumes`
- `GET /api/analytics/dashboard`
- `POST /api/analyzer/job-description`

## Demo Credentials

Create a user in the app or use the seed route:

```bash
npm run seed --workspace server
```

This creates demo data for testing features.

## Future Improvements

- AI-powered CV matching
- LinkedIn import integration
- Calendar sync
- Smart reminders and outreach automation
- Advanced analytics and forecasting

## Deployment Instructions

For deployment, set production environment values and deploy the backend to a Node.js hosting provider with MongoDB Atlas. Build the frontend and serve the generated static assets or use a static hosting platform.

## Author

Nazish
