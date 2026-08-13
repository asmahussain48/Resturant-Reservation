const { body, validationResult } = require("express-validator");
const { getAvailableSlots } = require("../services/availabilityService");

const reservationValidation = [
  body("tableId").notEmpty().withMessage("Table ID is required"),

  body("reservationDate")
    .notEmpty()
    .withMessage("Reservation date is required")
    .custom((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new Error("Cannot reserve a past date");
      }

      return true;
    }),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .custom(async (time) => {
      const allowedSlots = await getAvailableSlots();

      if (!allowedSlots.includes(time)) {
        throw new Error("This time is outside the current restaurant hours");
      }

      return true;
    }),

  body("numberOfPeople")
    .isInt({ min: 1 })
    .withMessage("Number of people must be at least 1"),

  body("customerName").notEmpty().withMessage("Customer name is required"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 11, max: 11 })
    .withMessage("Phone number must contain 11 digits"),
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
}

module.exports = {
  reservationValidation,
  validateRequest,
};
