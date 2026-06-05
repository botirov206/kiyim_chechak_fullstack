# Kiyim Chechak Full Stack

Monorepo for the **Kiyim Chechak** clothing retail platform: API backend and web frontend in one repository.

## Structure

| Directory   | Description |
|------------|-------------|
| `backend/` | Node.js, Express, TypeScript, PostgreSQL (Prisma). ERP/CRM/WMS API, JWT auth, Docker. See [backend/README.md](backend/README.md). |
| `frontend/`| React, TypeScript, Vite, Tailwind. Customer and admin UI. See [frontend/README.md](frontend/README.md). |

## Quick start

1. **Backend** — copy `backend/.env.example` to `backend/.env`, install deps, run migrations, start the API.
2. **Frontend** — copy `frontend/.env.example` to `frontend/.env`, install deps, run the dev server.

Each package has its own `package.json`; run `npm install` and npm scripts from the corresponding folder.

## Notes

- Do not commit `.env` files; use `.env.example` as templates.
- Previously separate repos: `backend_kiyim_kechak` and `frontend_kiyim_kechak` are now combined here.