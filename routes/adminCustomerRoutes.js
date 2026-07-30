const express = require("express");

const router = express.Router();

const {
  getCustomers,

  getCustomerById,

  getCustomerReservations,
} = require("../controllers/adminCustomerController");

const { requireAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

// All customers

router.get(
  "/admin/customers",

  requireAuth,

  isAdmin,

  getCustomers,
);

// Single customer details

router.get(
  "/admin/customers/:id",

  requireAuth,

  isAdmin,

  getCustomerById,
);

// Customer reservation history

router.get(
  "/admin/customers/:id/reservations",

  requireAuth,

  isAdmin,

  getCustomerReservations,
);

router.get("/admin/customers-page", requireAuth, isAdmin, (req, res) => {
  res.render("admin/customers");
});

router.get("/admin/customer-details/:id", requireAuth, isAdmin, (req, res) => {
  res.render("admin/customerDetails");
});

module.exports = router;
