async function loadDashboard() {
    try {
      const response = await fetch("/admin/dashboard");
  
      const data = await response.json();
  
      if (!data.success) {
        alert(data.message);
  
        return;
      }
  
      const dashboard = data.data;
  
      document.getElementById("todayReservations").innerText =
        dashboard.todayReservations;
  
      document.getElementById("upcomingReservations").innerText =
        dashboard.upcomingReservations;
  
      document.getElementById("todayGuests").innerText = dashboard.todayGuests;
  
      document.getElementById("availableTables").innerText =
        dashboard.availableTables;
  
      document.getElementById("occupiedTables").innerText =
        dashboard.occupiedTables;
  
      document.getElementById("cancelledReservations").innerText =
        dashboard.cancelledReservations;
    } catch (error) {
      console.log(error);
    }
  }
  
  loadDashboard();
  
  const logoutButton = document.getElementById("logoutButton");
  
  if (logoutButton) {
    logoutButton.onclick = async () => {
      const response = await fetch("/logout", {
        method: "POST",
      });
  
      const data = await response.json();
  
      if (data.success) {
        window.location.href = "/login";
      }
    };
  }
  


  // ===============================
// WEEKLY RESERVATIONS CHART
// ===============================

async function loadWeeklyChart(){

    const response =
    await fetch("/admin/dashboard/reservations-weekly");

    const result =
    await response.json();


    new Chart(
        document.getElementById("weeklyChart"),
        {
            type:"bar",

            data:{
                labels: result.data.map(item=>item._id),

                datasets:[{
                    label:"Reservations",

                    data: result.data.map(item=>item.reservations)
                }]
            },


            options:{
                responsive:true,
                maintainAspectRatio:false,

                plugins:{
                    legend:{
                        position:"bottom"
                    }
                }
            }
        }
    );

}





// ===============================
// PEAK HOURS CHART
// ===============================

async function loadPeakChart(){

    const response =
    await fetch("/admin/dashboard/peak-hours");


    const result =
    await response.json();



    new Chart(
        document.getElementById("peakChart"),
        {

            type:"line",

            data:{

                labels:
                result.data.map(item=>item._id),


                datasets:[{

                    label:"Bookings",

                    data:
                    result.data.map(item=>item.count)

                }]

            },


            options:{

                responsive:true,

                maintainAspectRatio:false,


                plugins:{
                    legend:{
                        position:"bottom"
                    }
                }

            }

        }
    );

}





// ===============================
// TABLE UTILIZATION CHART
// ===============================

async function loadTableChart(){

    const response =
    await fetch("/admin/dashboard/table-utilization");


    const result =
    await response.json();



    new Chart(
        document.getElementById("tableChart"),
        {

            type:"doughnut",


            data:{


                labels:
                result.data.map(
                    item =>
                    item.table[0]?.tableNumber || "Unknown"
                ),


                datasets:[{

                    label:"Usage",

                    data:
                    result.data.map(
                        item=>item.usage
                    )

                }]

            },


            options:{

                responsive:true,

                maintainAspectRatio:false,


                plugins:{
                    legend:{
                        position:"bottom"
                    }
                }

            }

        }
    );

}





// ===============================
// CUSTOMER GROWTH CHART
// ===============================

async function loadCustomerChart(){

    const response =
    await fetch("/admin/dashboard/customer-growth");


    const result =
    await response.json();



    new Chart(
        document.getElementById("customerChart"),
        {

            type:"bar",


            data:{


                labels:
                result.data.map(
                    item=>"Month "+item._id.month
                ),



                datasets:[{

                    label:"Customers",

                    data:
                    result.data.map(
                        item=>item.customers
                    )

                }]

            },


            options:{

                responsive:true,

                maintainAspectRatio:false,


                plugins:{
                    legend:{
                        position:"bottom"
                    }
                }

            }

        }
    );

}





loadWeeklyChart();

loadPeakChart();

loadTableChart();

loadCustomerChart();