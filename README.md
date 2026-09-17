# Restaurant Reservation (Resturant-Reservation)

A full-stack Node.js + Express application for managing restaurant reservations, tables, menus, admin settings, and basic analytics. Uses EJS for server-side views, MongoDB (via Mongoose) for persistence, and sessions stored in MongoDB.

This README covers setup, running, project structure, environment variables, and common development tasks.

---

## Project at a glance

- Entry point: [server.js](D:/Express/Resturant-Reservation-main/server.js)
- Main app: [app.js](D:/Express/Resturant-Reservation-main/app.js)
- Package metadata & scripts: [package.json](D:/Express/Resturant-Reservation-main/package.json)
- View engine: EJS (server-rendered views in `views/`)
- Database: MongoDB via Mongoose
- Session store: connect-mongo (stores sessions in MongoDB)
- Dev tooling: nodemon, Tailwind CSS (devDependency)

---

## Features

- Public frontend pages (menus, reservation form, etc.)
- Authentication (sessions)
- Table management (CRUD for restaurant tables)
- Reservation management (create, list, manage reservations)
- Admin area (settings, customers, menus, analytics)
- Server-side rendered views with EJS and static assets under `public/`

---

## Requirements

- Node.js (recommended v16+)
- npm (or yarn)
- MongoDB instance (local or cloud; MongoDB Atlas recommended)

---

## Environment variables

Copy `.env.example` to `.env` and fill in real values (never commit `.env`). Required variables:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/restaurant-db
SESSION_SECRET=some_long_random_secret
PORT=3000          # optional; defaults to 3000
NODE_ENV=development
```

Notes:
- `MONGODB_URI` is used for both application data and session store (connect-mongo).
- `SESSION_SECRET` must be a strong random string in production.

---

## Install & run

Install dependencies:

On Windows PowerShell or CMD:

```
npm install
```

Run in development (auto-restarts with nodemon):

```
npm run dev
```

Start production server:

```
npm start
```

The server listens on the port defined by `PORT` (defaults to 3000). After startup, the console will show a line like:

```
Server running at http://localhost:3000
```

---

## Useful scripts

- `npm start` — Run the server (`node server.js`).
- `npm run dev` — Run server with `nodemon` for development.

See [package.json](D:/Express/Resturant-Reservation-main/package.json) for the exact scripts.

---

## Project structure (high level)

- `server.js` — bootstraps app and connects to MongoDB.
- `app.js` — Express app setup, middlewares, route imports, view engine.
- `config/` — DB and session configuration (`config/db.js`, `config/session.js`).
- `routes/` — route definitions. Notable route files (examples):
  - `frontendRoutes.js` — frontend/end-user pages
  - `authRoutes.js` — sign-in, sign-up, sign-out
  - `reservationRoutes.js`, `menuRoutes.js`, `settingsRoutes.js`
  - `admin*` routes — admin area (reservations, tables, settings, menu, customers, analytics)
- `controllers/` — request handlers (note: lowercase directory name — required on Vercel/Linux, which is case-sensitive, unlike Windows)
- `models/` — Mongoose models (e.g., `RestaurantTable`, reservation and user models)
- `views/` — EJS templates
- `public/` — static assets (CSS, JS, images)
- `api/index.js` — serverless entrypoint used only on Vercel (see below); local dev still uses `server.js`

Refer to the code to inspect specific route and model details: [app.js](D:/Express/Resturant-Reservation-main/app.js)

---

## Important implementation notes

- MongoDB connection string is read from `process.env.MONGODB_URI` in `config/db.js`.
- Sessions are configured in `config/session.js` and persisted to the MongoDB `sessions` collection using `connect-mongo`.
- `express-session` cookie `secure` flag is enabled when `NODE_ENV === 'production'`.
- Views are rendered with EJS and served from the `views/` folder.

---

## Routes and API (quick summary)

This project defines many routes. A non-exhaustive list (inspect `routes/` for full details):

- Frontend pages and public endpoints: handled by `routes/frontendRoutes.js`
- Authentication: `routes/authRoutes.js`
- Reservations: `routes/reservationRoutes.js` and `routes/adminReservationRoutes.js`
- Tables (admin-only): `routes/adminTableRoutes.js`
- Menu: `routes/menuRoutes.js` and `routes/adminMenuRoutes.js`
- Admin settings & analytics: `routes/settingsRoutes.js`, `routes/adminSettingRoutes.js`, `routes/adminAnalyticsRoutes.js`

There is also one example endpoint included in `app.js`:

- `/api/profile` — authenticated profile endpoint (uses `requireAuth` middleware)

---

## Security & production checklist

- Use HTTPS in production and set `NODE_ENV=production`.
- Ensure `SESSION_SECRET` is strong and stored securely (environment manager / secrets manager).
- Secure MongoDB credentials (use least-privilege DB user and IP/network restrictions).
- `helmet` is applied globally and `express-rate-limit` throttles `/login` and `/register` (see `app.js`).
- If this repo's git history ever contained a real `.env` (check with `git log --all -- .env`), treat those credentials as compromised: rotate them and scrub the file from history (e.g. with `git filter-repo` or the BFG Repo-Cleaner) before making the repository public.

---

## Deploying to Vercel

This app runs as a single serverless function on Vercel. `api/index.js` wraps the Express app and reuses a cached MongoDB connection across invocations; `vercel.json` routes every request to it and bundles `views/` and `public/` into the function (EJS templates and static assets are read from disk at request time, not `require`d, so Vercel's automatic file-tracing won't include them without this).

1. Push this repo to GitHub.
2. In Vercel: **New Project** → import the repo → Framework Preset: **Other**.
3. Add environment variables (Project Settings → Environment Variables): `MONGODB_URI`, `SESSION_SECRET`, `NODE_ENV=production`. Don't set `PORT` — Vercel doesn't use it.
4. In MongoDB Atlas → Network Access, allow `0.0.0.0/0` (Vercel's serverless IPs aren't fixed).
5. Deploy. Every subsequent push to the connected branch redeploys automatically.

Notes:
- Sessions are stored in MongoDB (`connect-mongo`), not in server memory, so they work correctly across the stateless serverless functions.
- Local development (`npm run dev` / `npm start`) is unaffected — it still uses `server.js` and `app.listen()`. `api/index.js` is only invoked by Vercel.

---

## Development tips

- Tailwind is listed as a devDependency — compile and include assets as part of your build if using its tooling.
- EJS templates render server-side UI — edit templates in `views/` and corresponding static assets in `public/`.

---

## Testing

There are no automated tests included by default. To add tests, consider using Jest or Mocha + Supertest for route and integration tests.

---

## Contributing

1. Fork the repo and create a feature branch.
2. Make changes and test locally.
3. Submit a pull request describing the change.

Be sure to keep secrets and `.env` values out of the repository.

---

## License

This project uses the ISC license as defined in [package.json](D:/Express/Resturant-Reservation-main/package.json).

---

## Contact

For questions or issues, open an issue in the repository or contact the maintainer (add contact details in `package.json` or the repo settings).



---

Thank you for using the Restaurant Reservation app! If anything in this README needs to be tailored to your deployment or environment (Docker, CI, specific MongoDB configuration, or seed data), provide details and the README can be updated accordingly.
