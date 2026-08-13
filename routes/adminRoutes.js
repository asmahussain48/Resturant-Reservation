const express = require("express");

const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

router.get("/admin/menu-page", requireAuth, isAdmin, (req, res) => {
  res.redirect("/admin/menu");
});


module.exports = router;
