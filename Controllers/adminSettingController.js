const RestaurantSettings = require("../models/RestaurantSettings");

// GET SETTINGS

async function getSettings(req, res) {
  try {
    const settings = await RestaurantSettings.findOne();

    res.json({
      success: true,

      settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// UPDATE SETTINGS

async function updateSettings(req, res) {
  try {
    const settings = await RestaurantSettings.findOneAndUpdate(
      {},

      req.body,

      {
        new: true,
      },
    );

    res.json({
      success: true,

      message: "Settings updated successfully",

      settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// OPEN / CLOSE RESTAURANT

async function updateRestaurantStatus(req, res) {
  try {
    const { isOpen } = req.body;

    const settings = await RestaurantSettings.findOneAndUpdate(
      {},

      {
        isOpen,
      },

      {
        new: true,
      },
    );

    res.json({
      success: true,

      message: "Restaurant status updated",

      settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

module.exports = {
  getSettings,

  updateSettings,

  updateRestaurantStatus,
};
