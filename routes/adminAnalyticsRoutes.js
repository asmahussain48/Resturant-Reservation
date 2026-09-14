const express = require("express");

const router = express.Router();

const {
  getDashboard,

  getWeeklyReservations,

  getReservationStatusBreakdown,

  getPeakHours,

  getTableUtilization,

  getCustomerGrowth,
} = require("../controllers/adminAnalyticsController");

const { requireAuth, requirePageAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

router.get("/admin/dashboard", requireAuth, isAdmin, getDashboard);

router.get(
  "/admin/dashboard/reservations-weekly",
  requireAuth,
  isAdmin,
  getWeeklyReservations,
);

router.get(
  "/admin/dashboard/reservation-status",
  requireAuth,
  isAdmin,
  getReservationStatusBreakdown,
);

router.get("/admin/dashboard/peak-hours", requireAuth, isAdmin, getPeakHours);

router.get(
  "/admin/dashboard/table-utilization",
  requireAuth,
  isAdmin,
  getTableUtilization,
);

router.get(
  "/admin/dashboard/customer-growth",
  requireAuth,
  isAdmin,
  getCustomerGrowth,
);


router.get("/admin/dashboard-page", requirePageAuth, isAdmin, (req, res) => {
  res.render("admin/dashboard");
});
module.exports = router;
