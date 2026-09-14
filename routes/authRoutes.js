const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  validateRequest,
} = require("../validators/authValidators");

const router = express.Router();

router.post("/register", registerValidation, validateRequest, registerUser);

router.post("/login", loginValidation, validateRequest, loginUser);

router.post("/logout", logoutUser);


module.exports = router;