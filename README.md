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

Create a `.env` file in the project root (not committed). Required variables:

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
  - `tableRoutes.js`, `reservationRoutes.js`, `menuRoutes.js`, `settingsRoutes.js`
  - `admin*` routes — admin area (reservations, tables, settings, menu, customers, analytics)
- `models/` — Mongoose models (e.g., `RestaurantTable`, reservation and user models)
- `views/` — EJS templates
- `public/` — static assets (CSS, JS, images)

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
- Tables: `routes/tableRoutes.js` and `routes/adminTableRoutes.js`
- Menu: `routes/menuRoutes.js` and `routes/adminMenuRoutes.js`
- Admin settings & analytics: `routes/settingsRoutes.js`, `routes/adminSettingRoutes.js`, `routes/adminAnalyticsRoutes.js`

There are also example/test endpoints included in `app.js` such as:

- `/session-test` — simple session visit counter
- `/api/profile` — authenticated profile endpoint (uses `requireAuth` middleware)
- `/check-tables` — temporary endpoint to fetch tables (remove or secure in production)

---

## Security & production checklist

- Use HTTPS in production and set `NODE_ENV=production`.
- Ensure `SESSION_SECRET` is strong and stored securely (environment manager / secrets manager).
- Secure MongoDB credentials (use least-privilege DB user and IP/network restrictions).
- Remove or protect any temporary or debugging routes (e.g., `/check-tables`) before public deployment.
- Configure rate limiting and helmet (helmet is already included as a dependency) and follow OWASP recommendations.

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
