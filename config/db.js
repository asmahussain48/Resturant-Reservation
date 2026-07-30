const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    //Connects Node.js with MongoDB.
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
//Stops the server if MongoDB cannot connect.
    process.exit(1);
  }
}

module.exports = connectDatabase;