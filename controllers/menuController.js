const Menu = require("../models/Menu");

async function getMenu(req, res) {
  try {
    const menuItems = await Menu.find({
      isAvailable: true,
    }).sort({
      category: 1,
      name: 1,
    });

    return res.status(200).json({
      success: true,
      menu: menuItems,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

module.exports = {
  getMenu,
};
