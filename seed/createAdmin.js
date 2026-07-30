const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);

  const passwordHash = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",

    email: "admin@gmail.com",

    phone: "03000000000",

    passwordHash,

    role: "admin",
  });

  console.log("Admin created");

  process.exit();
}

createAdmin();
