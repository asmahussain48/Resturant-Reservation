const mongoose = require("mongoose");


const reservationSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantTable",
      required: true,
    },


    customerName: {
      type: String,
      required: true,
      trim: true,
    },


    phone: {
      type: String,
      required: true,
      trim: true,
    },


    reservationDate: {
      type: String,
      required: true,
    },


    startTime: {
      type: String,
      required: true,
    },


    endTime: {
      type: String,
      required: true,
    },


    numberOfPeople: {
      type: Number,
      required: true,
      min: 1,
    },


    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed"
      ],
      default: "confirmed",
    }

  },
  {
    timestamps: true,
  }
);



// Prevent double booking, but only among active reservations - a cancelled
// reservation must free up the same table/date/time slot for someone else.
reservationSchema.index(
  {
    table: 1,
    reservationDate: 1,
    startTime: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: [
          "pending",
          "confirmed"
        ]
      }
    }
  }
);

/*
Same table
+
Same date
+
Same time
=
Duplicate booking ❌
*/


const Reservation = mongoose.model(
  "Reservation",
  reservationSchema
);


module.exports = Reservation;