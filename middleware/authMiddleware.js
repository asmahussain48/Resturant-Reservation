function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  next();
}

function requirePageAuth(req, res, next) {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    return req.session.save(() => res.redirect("/login"));
  }

  next();
}

function requireGuest(req, res, next) {
  if (!req.session.user) return next();
  return res.redirect(req.session.user.role === "admin" ? "/admin/dashboard-page" : "/menu");
}

module.exports = {
  requireAuth,
  requirePageAuth,
  requireGuest,
};



// Request
//   |
//   ↓
// requireAuth middleware
//   |
//   |
//   |-- User logged in?
//   |
//  Yes        No
//   |          |
//   ↓          ↓
// Controller   401 Error
