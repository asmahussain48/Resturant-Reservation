require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
