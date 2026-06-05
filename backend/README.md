# Cloud ERP CRM WMS Backend

Production-ready Node.js + Express + TypeScript backend for a Cloud ERP / CRM / WMS platform.

Technologies:

- Node.js + Express + TypeScript
- PostgreSQL with Prisma ORM
- JWT authentication & role-based authorization (Admin, Manager, Employee)
- Zod validation
- Centralized error handling & logging (Winston)

## Requirements

- Node.js 18+
- PostgreSQL database (local or Render PostgreSQL instance)

## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Required variables:

- `NODE_ENV`
- `PORT`
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `LOG_LEVEL`

On Render, `DATABASE_URL` is injected automatically when you attach the Render PostgreSQL database defined in `render.yaml`.

## Installation

```bash
npm install
```

## Prisma: Generate Client & Migrations

The schema is defined in `prisma/schema.prisma`. To generate the Prisma client and create the initial migration:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This will:

- Create the PostgreSQL schema
- Generate the Prisma client into `generated/prisma`

To apply migrations in production:

```bash
npx prisma migrate deploy
```

## Seeding the Database

The seed script creates:

- An admin user (email: `admin@example.com`, password: `Admin123!`)
- Sample customers, products, warehouses, inventory, orders, and a report

Run locally:

```bash
npx prisma db seed
```

Render build uses `npx prisma db seed` automatically via `render.yaml`.

## Development

```bash
npm run dev
```

API base URL (default):

- `http://localhost:3000/api`

Health check:

- `GET /api/health`

## Authentication & Authorization

- `POST /api/auth/register` – create a user and get a JWT
- `POST /api/auth/login` – login and get a JWT
- `GET /api/auth/profile` – get current user profile (requires `Authorization: Bearer <token>`)

Roles:

- `ADMIN`
- `MANAGER`
- `EMPLOYEE`

Protected routes use:

- `authenticate` middleware (JWT)
- `authorize` / `authorizeMinRole` middleware for role-based access

## Main Resources & CRUD APIs

Base path: `/api`

- `/auth` – authentication
- `/users` – user management (Admin only)
- `/customers` – customers
- `/products` – products
- `/warehouses` – warehouses
- `/inventory` – inventory & low-stock
- `/orders` – orders & order items
- `/reports` – reports & auto-generated reports

All list endpoints support pagination via query params:

- `page`, `limit`, `search`, `sortBy`, `sortOrder`

Validation is handled with Zod in `src/validators`.

## Render Deployment

This project is configured to deploy on Render without code changes.

1. Push this backend folder to a Git repository (GitHub, GitLab, etc.).
2. Log in to Render and click **New +** → **Blueprint**.
3. Select your repository.
4. Render will detect `render.yaml` and create:
   - A Node web service (`cloud-erp-crm-wms-backend`)
   - A PostgreSQL database (`cloud-erp-crm-wms-db`)
5. Click **Apply** to create resources.

The blueprint configuration:

- Installs dependencies
- Builds the TypeScript project
- Runs `prisma migrate deploy`
- Runs `prisma db seed`
- Starts the server (`npm run start`)

No manual schema creation is needed; Prisma migrations handle database creation.

## Build & Type Checking

To build and type-check:

```bash
npm run typecheck
npm run build
```

Both must succeed with zero TypeScript errors before deploying to production.

## Production Run Locally

```bash
npm run build
npx prisma migrate deploy
npx prisma db seed
npm run start
```

The server will listen on `PORT` (default 3000) and serve the API at `/api`.

