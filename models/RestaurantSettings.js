const mongoose = require("mongoose");

const restaurantSettingsSchema = new mongoose.Schema(
  {
    openingTime: {
      type: String,
      required: true,
    },

    closingTime: {
      type: String,
      required: true,
    },

    slotDuration: {
      type: Number,
      required: true,
      default: 2,
    },

    availableDays: [
      {
        type: String,
      },
    ],

    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const RestaurantSettings = mongoose.model(
  "RestaurantSettings",
  restaurantSettingsSchema,
);

module.exports = RestaurantSettings;
