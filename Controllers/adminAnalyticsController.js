const Reservation = require("../models/Reservation");
const RestaurantTable = require("../models/RestaurantTable");
const User = require("../models/User");

// DASHBOARD OVERVIEW

async function getDashboard(req, res) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Today's reservations

    const todayReservations = await Reservation.countDocuments({
      reservationDate: today,

      status: {
        $in: ["pending", "confirmed"],
      },
    });

    // Upcoming reservations

    const upcomingReservations = await Reservation.countDocuments({
      reservationDate: {
        $gte: today,
      },

      status: {
        $in: ["pending", "confirmed"],
      },
    });

    // Total active tables

    const availableTables = await RestaurantTable.countDocuments({
      isActive: true,
    });

    // Occupied tables today

    const occupiedTables = await Reservation.countDocuments({
      reservationDate: today,

      status: {
        $in: ["pending", "confirmed"],
      },
    });

    // Today's guests

    const guests = await Reservation.aggregate([
      {
        $match: {
          reservationDate: today,

          status: {
            $in: ["pending", "confirmed"],
          },
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: "$numberOfPeople",
          },
        },
      },
    ]);

    const todayGuests = guests.length ? guests[0].total : 0;

    // Cancelled reservations

    const cancelledReservations = await Reservation.countDocuments({
      status: "cancelled",
    });

    res.json({
      success: true,

      data: {
        todayReservations,

        upcomingReservations,

        availableTables,

        occupiedTables,

        todayGuests,

        cancelledReservations,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// RESERVATIONS PER WEEK

async function getWeeklyReservations(req,res){

    try{


        const reservations =
        await Reservation.aggregate([

            {
                $group:{
                    _id:"$reservationDate",
                    reservations:{
                        $sum:1
                    }
                }
            },

            {
                $sort:{
                    _id:1
                }
            }

        ]);



        res.json({

            success:true,

            data:reservations

        });



    }
    catch(error){

        console.log(error);


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

}

// PEAK HOURS

async function getPeakHours(req,res){

    try{


        const data =
        await Reservation.aggregate([


            {
                $group:{

                    _id:"$startTime",

                    count:{
                        $sum:1
                    }

                }

            },


            {
                $sort:{
                    count:-1
                }
            }


        ]);



        res.json({

            success:true,

            data

        });



    }
    catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

}

// TABLE USAGE

async function getTableUtilization(req,res){

    try{


        const data =
        await Reservation.aggregate([


            {
                $group:{

                    _id:"$table",

                    usage:{
                        $sum:1
                    }

                }

            },


            {
                $lookup:{

                    from:"restauranttables",

                    localField:"_id",

                    foreignField:"_id",

                    as:"table"

                }

            }


        ]);



        res.json({

            success:true,

            data

        });



    }
    catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

}

// CUSTOMER GROWTH

async function getCustomerGrowth(req,res){

    try{


        const data =
        await User.aggregate([


            {

                $group:{

                    _id:{
                        month:{
                            $month:"$createdAt"
                        }
                    },


                    customers:{
                        $sum:1
                    }


                }


            }


        ]);



        res.json({

            success:true,

            data

        });



    }
    catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

}

module.exports = {
  getDashboard,

  getWeeklyReservations,

  getPeakHours,

  getTableUtilization,

  getCustomerGrowth,
};
