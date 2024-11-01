export function updateDashboardTotalSalesToday(newTotal) {
  // Retrieve and parse the stringified object from localStorage
  let dashboardData = JSON.parse(localStorage.getItem("dashboardData"));

  if (dashboardData && dashboardData.daily_sales.length > 0) {
    // Update the total of the last item in daily_sales
    dashboardData.daily_sales[dashboardData.daily_sales.length - 1].total =
      newTotal;

    // Resave the modified object back into localStorage as a string
    localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
  } else {
    console.error("No daily sales data found in localStorage.");
  }
}
