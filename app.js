const express = require("express");
const path = require("path");

const app = express();

// ======================
// EJS Setup
// ======================

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// ======================
// Middlewares
// ======================

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

const tableRoutes = require("./routes/tableRoutes");

const reservationRoutes = require("./routes/reservationRoutes");

const menuRoutes = require("./routes/menuRoutes");

const settingsRoutes = require("./routes/settingsRoutes");

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
// Temporary Session Test
// ======================

app.get("/session-test", (req, res) => {
  if (!req.session.visitCount) {
    req.session.visitCount = 1;
  } else {
    req.session.visitCount++;
  }

  res.json({
    success: true,

    visitCount: req.session.visitCount,
  });
});

// ======================
// Profile API Test
// ======================

const { requireAuth } = require("./middleware/authMiddleware");

app.get("/api/profile", requireAuth, (req, res) => {
  res.json({
    success: true,

    user: req.session.user,
  });
});

// ======================
// Temporary Check Tables
// Remove after testing
// ======================

const RestaurantTable = require("./models/RestaurantTable");

app.get("/check-tables", async (req, res) => {
  try {
    const tables = await RestaurantTable.find();

    res.json({
      success: true,

      tables,
    });
  } catch (error) {
    res.json({
      success: false,

      message: error.message,
    });
  }
});



// ======================
// Routes Use
// ======================

app.use("/", pageRoutes);

app.use("/", frontendRoutes);

app.use("/", authRoutes);

app.use("/", tableRoutes);

app.use("/", reservationRoutes);

app.use("/", menuRoutes);

app.use("/", settingsRoutes);

// ======================
// Export
// ======================

module.exports = app;
