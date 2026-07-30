const mongoose = require("mongoose");

const restaurantTableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: [true, "Table number is required"],
      unique: true,
      min: [1, "Table number must be at least 1"],
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const RestaurantTable = mongoose.model(
  "RestaurantTable",
  restaurantTableSchema
);

module.exports = RestaurantTable;