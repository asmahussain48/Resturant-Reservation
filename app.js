const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ======================
// EJS Setup
// ======================

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// ======================
// Middlewares
// ======================

app.use(
  helmet({
    // Tailwind is loaded from a CDN and the reservation/menu pages use inline
    // <script> blocks, so a strict default CSP would break the app.
    contentSecurityPolicy: false,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Static Files

app.use(express.static(path.join(__dirname, "public")));

// ======================
// Routes Import
// ======================

const frontendRoutes = require("./routes/frontendRoutes");

const pageRoutes = require("./routes/pageRoutes");

const authRoutes = require("./routes/authRoutes");

const reservationRoutes = require("./routes/reservationRoutes");

const menuRoutes = require("./routes/menuRoutes");

const settingsRoutes = require("./routes/settingsRoutes");

const adminRoutes = require("./routes/adminRoutes");

const adminReservationRoutes = require("./routes/adminReservationRoutes");

const adminTableRoutes = require("./routes/adminTableRoutes");

const adminSettingRoutes = require("./routes/adminSettingRoutes");

const adminMenuRoutes = require("./routes/adminMenuRoutes");

const adminCustomerRoutes = require("./routes/adminCustomerRoutes");

const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");
// ======================
// Session
// ======================

const sessionMiddleware = require("./config/session");

app.use(sessionMiddleware);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;

  next();
});

// ======================
// Profile API
// ======================

const { requireAuth } = require("./middleware/authMiddleware");

app.get("/api/profile", requireAuth, (req, res) => {
  res.json({
    success: true,

    user: req.session.user,
  });
});

// ======================
// Rate Limiting (auth endpoints)
// ======================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

// ======================
// Routes Use
// ======================

app.use("/", pageRoutes);

app.use("/", frontendRoutes);

app.use("/register", authLimiter);
app.use("/login", authLimiter);
app.use("/", authRoutes);

app.use("/", reservationRoutes);

app.use("/", menuRoutes);

app.use("/", settingsRoutes);

app.use("/", adminRoutes);

app.use("/", adminReservationRoutes);

app.use("/", adminTableRoutes);

app.use("/", adminSettingRoutes);

app.use("/", adminMenuRoutes);

app.use("/", adminCustomerRoutes);

app.use("/", adminAnalyticsRoutes);

// ======================
// 404 + Error Handling
// ======================

const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

app.use(notFound);
app.use(errorHandler);

// ======================
// Export
// ======================

module.exports = app;
