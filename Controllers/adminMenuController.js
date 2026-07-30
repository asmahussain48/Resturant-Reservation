const Menu = require("../models/Menu");

// GET ALL MENU ITEMS

async function getMenu(req, res) {
  try {
    const menu = await Menu.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,

      menu,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// CREATE MENU ITEM

// CREATE MENU ITEM

async function createMenuItem(req, res) {
  try {

    const {
      name,
      description,
      category,
      price
    } = req.body;


    const item = await Menu.create({

      name,

      description,

      category,

      price,

    });


    res.status(201).json({

      success: true,

      message: "Menu item created",

      item,

    });


  } catch (error) {

    console.log(error);


    res.status(500).json({

      success: false,

      message: error.message,

    });

  }
}
// UPDATE MENU ITEM

async function updateMenuItem(req, res) {
  try {
    const item = await Menu.findByIdAndUpdate(
      req.params.id,

      req.body,

      {
        new: true,
      },
    );

    res.json({
      success: true,

      message: "Menu updated",

      item,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// DELETE MENU ITEM

async function deleteMenuItem(req, res) {
  try {
    await Menu.findByIdAndDelete(req.params.id);

    res.json({
      success: true,

      message: "Menu deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// AVAILABLE / NOT AVAILABLE

async function updateMenuStatus(req, res) {
  try {
    const { available } = req.body;

    const item = await Menu.findByIdAndUpdate(
      req.params.id,

      {
        available,
      },

      {
        new: true,
      },
    );

    res.json({
      success: true,

      message: "Menu status updated",

      item,
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
  getMenu,

  createMenuItem,

  updateMenuItem,

  deleteMenuItem,

  updateMenuStatus,
};
