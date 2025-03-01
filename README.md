# nextExample

A modern Next.js application showcasing authentication, task management, and theming capabilities.

## Features

- 🔐 Authentication with better-auth
- 🎨 Dark/Light theme support
- 🗃️ PostgreSQL database support with Prisma
- 📁 File storage with MinIO
- 🎯 Type-safe database operations
- 🎨 Styled with Tailwind CSS and shadcn/ui

## Prerequisites

- Node.js 18+
- PostgreSQL
  - use a local docker-instance or use a free remote instance from [supabase](https://supabase.com) or [tembo](https://tembo.io)
- MinIO server (for file storage)

## Environment Variables

copy the `.env.example` file to `.env.local` and fill in with your values.

## Getting Started

1. Install dependencies:

```bash
npm install
```

1. b) Install husky hooks:

```bash
npm run prepare
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Run database migrations:

```bash
npx prisma db push
```

4. Start the development server on port 3001:

```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Seed Database for Testing

- `npm run seed:initial` - Builds typescript resources and seeds the database with initial data.
- `npm run seed` - Seeds the database with initial data. Use if typescript files are already built.
- `npm run prisma:reset` - Deletes all data from the database.
- Login with the email address of a generated user (e.g. `lukas.sauerland@yahoo.de`) and the password `password`.

## Project Structure

```py
src/
├── app/ # Next.js app directory
├── components/ # React components
├── database/ # Database configuration and migrations
├── lib/ # Utility functions and configurations
└── middleware.ts # Authentication middleware
prisma/schema.prisma # Database schema
```

## Authentication

The project uses `better-auth` for authentication. Protected routes are handled by the middleware, which redirects unauthenticated users to the sign-in page.

## Styling

The project uses Tailwind CSS with shadcn/ui components. Theme configuration can be found in:

- `tailwind.config.ts`
- `src/app/globals.css`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
