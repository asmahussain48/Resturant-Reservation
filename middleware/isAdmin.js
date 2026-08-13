function isAdmin(req, res, next) {
  if (!req.session.user) {
    if (req.accepts("html")) return res.redirect("/login");
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  if (req.session.user.role !== "admin") {
    if (req.accepts("html")) return res.redirect("/menu");
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
}

module.exports = isAdmin;
