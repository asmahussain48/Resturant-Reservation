// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  console.error(error);

  const status = error.status || 500;

  if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/admin/api")) {
    return res.status(status).json({
      success: false,
      message: status === 500 ? "Server error" : error.message,
    });
  }

  res.status(status).render("pages/error", {
    message: status === 500 ? "Something went wrong" : error.message,
  });
}

module.exports = errorHandler;
