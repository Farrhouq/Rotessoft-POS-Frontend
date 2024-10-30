// export default async function loadDashboardData(url) {
//   apiClient.get(url).then((res) => {
//     setDashboardData(res.data);
//     setTopProducts(res.data.top_products);
//     setYesterdayTotal(res.data.daily_sales.slice(-2)[0].total);
//     animateNumber(res.data.slice(-1).total, setTodayTotal, 1);
//     localStorage.setItem("todayTotal", res.data.slice(-1).total);
//     setDailyTarget(res.data.daily_target);
//     let weeklyTotal = 0;
//     for (let week of res.data.daily_sales) {
//       weeklyTotal += week.total;
//     }
//     setWeeklyTotal(weeklyTotal);
//     let daily_totals = res.data.daily_sales.map((week) => week.total);
//     let week_labels = res.data.daily_sales.map((week) =>
//       formatDateLabels(week.sale__created_at__date),
//     );
//     daily_totals = Array(7 - daily_totals.length)
//       .fill(0)
//       .concat(daily_totals);
//     week_labels = fillBackwardDates(week_labels);
//     localStorage.setItem("dailyTotals", daily_totals);
//     localStorage.setItem("dailyTarget", res.data.daily_target);
//     setDateLabels(week_labels);
//     setDailyTotals(daily_totals);
//   });
// }

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
