const { body, validationResult } = require("express-validator");

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
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Invalid reservation time format"),

  body("numberOfPeople")
    .isInt({
      min: 1,
    })
    .withMessage("Number of people must be at least 1"),

  body("customerName").notEmpty().withMessage("Customer name is required"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")

    .isLength({
      min: 11,
      max: 11,
    })
    .withMessage("Phone number must contain 11 digits"),
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array();

    return res.status(400).json({
      success: false,
      message: validationErrors[0].msg,
      errors: validationErrors,
    });
  }

  next();
}

module.exports = {
  reservationValidation,
  validateRequest,
};
