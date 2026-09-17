require("dotenv").config();

const app = require("../app");
const connectDatabase = require("../config/db");

// Vercel serverless entrypoint. Express apps are directly callable as
// (req, res) request handlers, so once the (cached) MongoDB connection is
// ready, requests are simply handed off to the existing Express app - the
// same app used by server.js for local development.
module.exports = async (req, res) => {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(500).json({ success: false, message: "Database unavailable" });
    return;
  }

  app(req, res);
};
