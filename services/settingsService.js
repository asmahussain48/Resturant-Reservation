const RestaurantSettings = require("../models/RestaurantSettings");

async function getRestaurantSettings() {
  const settings = await RestaurantSettings.findOne();

  return settings;
}

module.exports = {
  getRestaurantSettings,
};
