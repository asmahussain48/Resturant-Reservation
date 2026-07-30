const express = require("express");

const {
  createTable,
} = require("../controllers/tableController");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/tables", requireAuth, createTable);

module.exports = router;