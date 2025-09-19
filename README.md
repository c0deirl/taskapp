# Task Management Application

A modern, full-stack task management application built with React, Express, and SQLite.

## Features

- User authentication (register/login)
- Create, read, update, and delete tasks
- Mark tasks as completed
- Responsive design with Tailwind CSS
- Real-time task updates
- Secure password hashing
- SQLite database for easy local development

## Tech Stack

### Frontend
- React with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching

### Backend
- Express.js with TypeScript
- SQLite database
- Drizzle ORM for type-safe database operations
- Winston for logging
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   ```

### Development

1. Start the backend server:
   ```bash
   npm run dev:server
   ```
2. Start the frontend development server:
   ```bash
   npm run dev:client
   ```
3. Visit http://localhost:5174 in your browser

### Database Management

The application uses SQLite with Drizzle ORM. To manage the database:

1. Generate migrations:
   ```bash
   npx drizzle-kit generate
   ```
2. Apply migrations:
   ```bash
   npx tsx server/migrate.ts
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks for the logged-in user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
