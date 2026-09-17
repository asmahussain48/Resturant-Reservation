const mongoose = require("mongoose");
const RestaurantSettings = require("../models/RestaurantSettings");

// Cached across invocations so a warm serverless container (Vercel) reuses
// the same MongoDB connection instead of opening a new one per request.
let connectionPromise = null;

async function ensureDefaultSettings() {
  const existingSettings = await RestaurantSettings.findOne();

  if (!existingSettings) {
    await RestaurantSettings.create({
      openingTime: "12:00",
      closingTime: "23:00",
      slotDuration: 2,
      availableDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      isOpen: true,
    });

    console.log("Default restaurant settings created");
  }
}

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .then(async (connection) => {
        console.log("MongoDB connected successfully");
        await ensureDefaultSettings();
        return connection;
      })
      .catch((error) => {
        // Let the next call retry instead of being stuck on a failed promise.
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDatabase;
