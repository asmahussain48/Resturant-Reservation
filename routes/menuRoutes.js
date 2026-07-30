const express = require("express");

const { getMenu } = require("../controllers/menuController");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api/menu", requireAuth, getMenu);

module.exports = router;
