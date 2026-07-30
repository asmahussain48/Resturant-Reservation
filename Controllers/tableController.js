const RestaurantTable = require("../models/RestaurantTable");

async function createTable(req, res) {
  try {
    const { tableNumber, capacity, location } = req.body;

    if (!tableNumber || !capacity || !location) {
      return res.status(400).json({
        success: false,
        message: "Table number, capacity and location are required",
      });
    }

    const existingTable = await RestaurantTable.findOne({
      tableNumber,
    });

    if (existingTable) {
      return res.status(409).json({
        success: false,
        message: "Table number already exists",
      });
    }

    const table = await RestaurantTable.create({
      tableNumber,
      capacity,
      location,
    });

    return res.status(201).json({
      success: true,
      message: "Table created successfully",
      table,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Table number already exists",
      });
    }

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

module.exports = {
  createTable,
};