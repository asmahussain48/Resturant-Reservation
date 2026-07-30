const express = require("express");

const router = express.Router();

const {
  getAllTables,
  createTable,
  updateTable,
  updateTableStatus,
} = require("../controllers/adminTableController");

const { requireAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

// PAGE ROUTE

router.get("/admin/tables", requireAuth, isAdmin, (req, res) => {
  res.render("admin/tables");
});

// API ROUTES

router.get("/admin/api/tables", requireAuth, isAdmin, getAllTables);

router.post("/admin/api/tables", requireAuth, isAdmin, createTable);

router.put("/admin/api/tables/:id", requireAuth, isAdmin, updateTable);

router.patch(
  "/admin/api/tables/:id/status",
  requireAuth,
  isAdmin,
  updateTableStatus,
);

module.exports = router;
