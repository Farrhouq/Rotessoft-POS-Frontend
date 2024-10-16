import React, { useEffect, useState } from "react";
// import Header from "../partials/Header";
// import FilterButton from "../components/DropdownFilter";
// import Datepicker from "../components/Datepicker";
import DailyProgress from "../partials/dashboard/DailyProgress";
import WeeklyOverview from "../partials/dashboard/WeeklyOverview";
import TopProducts from "../partials/dashboard/TopProducts";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import { checkLogin } from "../utils/Utils";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";

function Dashboard({ sidebarOpen, setSidebarOpen }) {
  const [dashboardData, setDashboardData] = useState({});
  const [todayTotal, setTodayTotal] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(10);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [dateLabels, setDateLabels] = useState([]);
  const [dailyTotals, setDailyTotals] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${month}-${day}-${year}`; // return 'dd-mm-yyyy'
  };

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

  useEffect(() => {
    const userRole = checkLogin();
    if (userRole == "admin") {
      navigate("/admin/");
    }
    apiClient.get("dashboard/").then((res) => {
      setDashboardData(res.data);
      setTopProducts(res.data.top_products);
      setYesterdayTotal(res.data.daily_sales.slice(-2)[0].total);
      animateNumber(res.data.total_sales_today, setTodayTotal, 1);
      setDailyTarget(res.data.daily_target);
      let weeklyTotal = 0;
      for (let week of res.data.daily_sales) {
        weeklyTotal += week.total;
      }
      setWeeklyTotal(weeklyTotal);
      localStorage.setItem(
        "dailyTotals",
        JSON.stringify(res.data.daily_sales.map((week) => week.total)),
      );
      localStorage.setItem("dailyTarget", res.data.daily_target);
      setDateLabels(
        res.data.daily_sales.map((week) =>
          formatDate(week.sale__created_at__date),
        ),
      );
      setDailyTotals(res.data.daily_sales.map((week) => week.total));
    });
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
