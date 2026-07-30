const bcrypt = require("bcrypt");
const User = require("../models/User");

async function registerUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    // Check empty fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      phone,
      passwordHash,
      role: "user",
      //Registration se koi khud ko admin nahi bana sakta.
    });

    // Save in MongoDB
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    // Duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create Session

    req.session.user = {
      id: user._id,

      name: user.name,

      role: user.role,
    };

    // Decide where user goes

    let redirect;

    if (user.role === "admin") {
      redirect = "/admin/dashboard-page";
    } else {
      redirect = "/menu";
    }

    return res.status(200).json({
      success: true,

      message: "Login successful",

      redirect,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    });
  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
}

async function logoutUser(req, res) {
  try {
//req.session.destroy()
//Removes the logged-in user's session from MongoDB.
    req.session.destroy((error) => {

      if (error) {
        return res.status(500).json({
          success: false,
          message: "Logout failed"
        });
      }


      res.clearCookie("restaurant.sid");
   
      return res.status(200).json({
        success: true,
        message: "Logout successful"
      });

    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
}
module.exports = {
  registerUser,
  loginUser,
  logoutUser
};