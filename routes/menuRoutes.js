const express = require("express");

const { getMenu } = require("../controllers/menuController");

const router = express.Router();

router.get("/api/menu", getMenu);

module.exports = router;
