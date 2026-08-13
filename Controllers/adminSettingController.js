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
    const { openingTime, closingTime, slotDuration } = req.body;

    if (!openingTime || !closingTime || !slotDuration) {
      return res.status(400).json({
        success: false,
        message: "Opening time, closing time and slot duration are required",
      });
    }

    if (openingTime >= closingTime) {
      return res.status(400).json({
        success: false,
        message: "Closing time must be later than opening time",
      });
    }

    const settings = await RestaurantSettings.findOneAndUpdate(
      {},
      { openingTime, closingTime, slotDuration },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Restaurant settings not found",
      });
    }

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

    if (typeof isOpen !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Restaurant status must be open or closed",
      });
    }

    const settings = await RestaurantSettings.findOneAndUpdate(
      {},

      {
        isOpen,
      },

      {
        new: true,
      },
    );

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Restaurant settings not found",
      });
    }

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
