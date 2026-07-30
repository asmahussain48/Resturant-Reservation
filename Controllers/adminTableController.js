const RestaurantTable = require("../models/RestaurantTable");

// GET ALL TABLES

async function getAllTables(req, res) {
  try {
    const tables = await RestaurantTable.find().sort({
      tableNumber: 1,
    });

    res.json({
      success: true,

      tables,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// CREATE TABLE

async function createTable(req, res) {
  try {
    const { tableNumber, capacity, location } = req.body;

    const table = await RestaurantTable.create({
      tableNumber,

      capacity,

      location,
    });

    res.status(201).json({
      success: true,

      message: "Table created successfully",

      table,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,

        message: "Table number already exists",
      });
    }

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// UPDATE TABLE

async function updateTable(req, res) {
  try {
    const table = await RestaurantTable.findByIdAndUpdate(
      req.params.id,

      req.body,

      {
        new: true,
      },
    );

    if (!table) {
      return res.status(404).json({
        success: false,

        message: "Table not found",
      });
    }

    res.json({
      success: true,

      message: "Table updated",

      table,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// UPDATE STATUS

async function updateTableStatus(req, res) {
  try {
    const { isActive } = req.body;

    const table = await RestaurantTable.findByIdAndUpdate(
      req.params.id,

      {
        isActive,
      },

      {
        new: true,
      },
    );

    if (!table) {
      return res.status(404).json({
        success: false,

        message: "Table not found",
      });
    }

    res.json({
      success: true,

      message: "Table status updated",

      table,
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
  getAllTables,

  createTable,

  updateTable,

  updateTableStatus,
};
