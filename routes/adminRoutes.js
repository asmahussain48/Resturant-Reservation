const express = require("express");

const router = express.Router();

const { requirePageAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

router.get("/admin/menu-page", requirePageAuth, isAdmin, (req, res) => {
  res.redirect("/admin/menu");
});


module.exports = router;
