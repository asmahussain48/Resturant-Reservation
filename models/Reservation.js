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



// Prevent double booking
// /* reservationSchema.index(
//   {
//     table: 1,
//     reservationDate: 1,
//     startTime: 1,
//   },
//   {
//     unique: true,
//   }
// ); it is uniquq but not alowing if a reservation created then cancel it still not allow others to use that cancel one reservation


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