const RestaurantSettings = require("../models/RestaurantSettings");

async function getSettings(req, res) {
  try {
    const settings = await RestaurantSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,

        message: "Settings not found",
      });
    }

    res.status(200).json({
      success: true,

      settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
}

module.exports = {
  getSettings,
};
