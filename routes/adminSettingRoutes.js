const express = require("express");

const router = express.Router();

const {
  getSettings,
  updateSettings,
  updateRestaurantStatus,
} = require("../controllers/adminSettingController");

const { requireAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

// PAGE ROUTE
router.get("/admin/settings", requireAuth, isAdmin, (req, res) => {
  res.render("admin/settings");
});

// API GET SETTINGS
router.get("/admin/api/settings", requireAuth, isAdmin, getSettings);

// API UPDATE SETTINGS
router.put("/admin/api/settings", requireAuth, isAdmin, updateSettings);

// API UPDATE STATUS
router.patch(
  "/admin/api/settings/status",
  requireAuth,
  isAdmin,
  updateRestaurantStatus,
);

module.exports = router;
