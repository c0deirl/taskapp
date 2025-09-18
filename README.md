# TaskApp

A modern task and to-do application built with React, Express, and PostgreSQL.

## Features

- ✅ Create, read, update, and delete tasks
- 🔄 Real-time updates
- 👤 User authentication and management
- 📱 Responsive design with Tailwind CSS
- 🌙 Dark mode support

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Radix UI Components
- React Hook Form with Zod validation
- Wouter for routing
- TanStack React Query

### Backend
- Express.js
- PostgreSQL with Neon Serverless
- Drizzle ORM
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (or Neon Serverless account)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/taskapp.git
   cd taskapp
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/taskapp"
   PORT=5000
   NODE_ENV=development
   ```

4. Push the database schema
   ```bash
   npm run db:push
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user

## Development

### Project Structure

```
taskapp/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Application pages
├── server/             # Backend Express application
│   ├── db.ts           # Database connection
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data access layer
└── shared/             # Shared code between client and server
    └── schema.ts       # Database schema definitions
```

### Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run check` - Type-check the application
- `npm run db:push` - Push schema changes to the database

## License

MIT
