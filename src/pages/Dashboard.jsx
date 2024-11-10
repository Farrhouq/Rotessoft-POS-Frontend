import React, { useEffect, useState } from "react";
import DailyProgress from "../partials/dashboard/DailyProgress";
import WeeklyOverview from "../partials/dashboard/WeeklyOverview";
import TopProducts from "../partials/dashboard/TopProducts";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import { checkLogin } from "../utils/Utils";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import { fillBackwardDates, formatDateLabels } from "../utils/dates";
import toaster from "react-hot-toast";

function Dashboard({ sidebarOpen, setSidebarOpen }) {
  const [dashboardData, setDashboardData] = useState({});
  const [todayTotal, setTodayTotal] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(10);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [dateLabels, setDateLabels] = useState([]);
  const [dailyTotals, setDailyTotals] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const shopId = localStorage.getItem("shopId");
  const navigate = useNavigate();
  const userRole = checkLogin();
  const [reloadVar, setReloadVar] = useState(false); // I'll be alternating this when you click on refresh so that useEffect will run again, reloading the data.
  const [loading, setLoading] = useState(false);

  function animateNumber(target, setValue, duration) {
    const start = 0; // Starting number
    const incrementTime = duration / target; // Time interval for incrementing
    let current = start;

    const interval = setInterval(() => {
      if (current + 149 < target) current += 149;
      else current = target;
      setValue(current);

      if (current >= target) {
        clearInterval(interval);
      }
    }, incrementTime + 70);
  }

  const useDashboardData = (data) => {
    setTopProducts(data.top_products);
    setYesterdayTotal(
      data.length > 2 ? data.daily_sales.slice(-2)[0].total : 0,
    );
    animateNumber(data.daily_sales.slice(-1)[0].total, setTodayTotal, 1);
    localStorage.setItem("todayTotal", data.daily_sales.slice(-1)[0].total);
    setDailyTarget(data.daily_target);
    let weeklyTotal = 0;
    for (let week of data.daily_sales) {
      weeklyTotal += week.total;
    }
    setWeeklyTotal(weeklyTotal);
    let daily_totals = data.daily_sales.map((week) => week.total);
    let week_labels = data.daily_sales.map((week) =>
      formatDateLabels(week.sale__created_at__date),
    );
    daily_totals = Array(7 - daily_totals.length)
      .fill(0)
      .concat(daily_totals);
    week_labels = fillBackwardDates(week_labels);
    localStorage.setItem("dailyTotals", daily_totals);
    localStorage.setItem("dailyTarget", data.daily_target);
    setDateLabels(week_labels);
    setDailyTotals(daily_totals);
  };

  function ensureTodayEntry() {
    // Retrieve and parse the stringified object from localStorage
    let dashboardData = JSON.parse(localStorage.getItem("dashboardData"));
    if (!dashboardData || !dashboardData.daily_sales) {
      console.error("No dashboard data or daily sales found in localStorage.");
      return;
    }

    // Get today's date in the same format (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Check if today's date is in daily_sales
    const todayExists = dashboardData.daily_sales.some(
      (entry) => entry.sale__created_at__date === today,
    );

    if (!todayExists) {
      // If today's entry is not in daily_sales, add it with a total of 0.0
      dashboardData.daily_sales.push({
        total: 0.0,
        sale__created_at__date: today,
      });

      // Save the updated dashboardData back to localStorage
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    }
    return dashboardData;
  }

  const loadDashboardData = () => {
    let dashUrl =
      userRole == "staff" ? "dashboard/" : `dashboard/?store=${shopId}`;
    setLoading(true);
    apiClient
      .get(dashUrl)
      .then((res) => {
        setLoading(false);
        setDashboardData(res.data);
        localStorage.setItem("dashboardData", JSON.stringify(res.data));
        useDashboardData(res.data);
      })
      .catch((res) => {
        setLoading(false);
        if (res.code == "ERR_NETWORK") toaster.error("You're offline");
        let dashboardData = JSON.parse(localStorage.getItem("dashboardData"));
        if (dashboardData) useDashboardData(ensureTodayEntry(dashboardData));
      });
  };

  useEffect(() => {
    const userRole = checkLogin();
    if (userRole == "admin" && shopId == null) {
      navigate("/admin/");
      return;
    }
    loadDashboardData();
  }, [reloadVar]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 640px)").matches) {
      let svgElement = document.getElementById("open-side-bar");
      svgElement.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    }
    const userRole = checkLogin();
    // localStorage.removeItem("products");
    // if (userRole == "admin") {
    //   navigate("/admin/");
    // }
    let dashboardData = JSON.parse(localStorage.getItem("dashboardData"));
    // console.log(ensureTodayEntry(dashboardData));
    if (dashboardData) useDashboardData(ensureTodayEntry(dashboardData));
    // loadDashboardData();
  }, []);

  return (
    <>
      <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Dashboard actions */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Dashboard
                <svg
                  onClick={() => setReloadVar(!reloadVar)}
                  className={`w-9 rounded-xl ${loading && `animate-spin`} ml-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 inline-block fill-purple-600 dark:fill-purple-400`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                </svg>
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Filter button */}
              {/* <FilterButton align="right" /> */}
              {/* Datepicker built with flatpickr */}
              {/* <Datepicker align="right" /> */}
              {/* Add view button */}
              <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                {/* <svg
                  className="fill-current shrink-0 xs:hidden"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg> */}
                <Link to="/sales/add/">
                  <span className="">Add Sale</span>
                </Link>
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-12 gap-6">
            <DailyProgress
              today={todayTotal}
              yesterday={yesterdayTotal}
              dailyTarget={dailyTarget}
            />
            <WeeklyOverview
              weeklyTotal={weeklyTotal}
              dateLabels={dateLabels}
              dailyTotals={dailyTotals}
            />
            <TopProducts products={topProducts} />
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
