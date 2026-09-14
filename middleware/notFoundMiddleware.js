function notFound(req, res) {
  if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/admin/api")) {
    return res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  }

  res.status(404).render("pages/notFound");
}

module.exports = notFound;
