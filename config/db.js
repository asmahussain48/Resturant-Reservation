const mongoose = require("mongoose");
const RestaurantSettings = require("../models/RestaurantSettings");

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
  try {
    //Connects Node.js with MongoDB.
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    await ensureDefaultSettings();
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
//Stops the server if MongoDB cannot connect.
    process.exit(1);
  }
}

module.exports = connectDatabase;