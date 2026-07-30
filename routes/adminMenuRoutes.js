const express = require("express");

const router = express.Router();

const {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateMenuStatus,
} = require("../controllers/adminMenuController");

const { requireAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

// PAGE ROUTE

router.get("/admin/menu", requireAuth, isAdmin, (req, res) => {
  res.render("admin/menu");
});

// API ROUTES

router.get("/admin/api/menu", requireAuth, isAdmin, getMenu);

router.post("/admin/api/menu", requireAuth, isAdmin, createMenuItem);

router.put("/admin/api/menu/:id", requireAuth, isAdmin, updateMenuItem);

router.delete("/admin/api/menu/:id", requireAuth, isAdmin, deleteMenuItem);

router.patch(
  "/admin/api/menu/:id/status",
  requireAuth,
  isAdmin,
  updateMenuStatus,
);

module.exports = router;
