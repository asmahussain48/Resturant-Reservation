function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  next();
}

module.exports = {
  requireAuth,
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