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

// Vercel's Node.js runtime parses JSON/form bodies itself by default, which
// consumes the request stream before Express's own express.json()/
// express.urlencoded() middleware gets a chance to read it - leaving
// req.body empty on every POST/PUT/PATCH. Disable Vercel's parsing so
// Express handles the body exactly like it does locally.
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
