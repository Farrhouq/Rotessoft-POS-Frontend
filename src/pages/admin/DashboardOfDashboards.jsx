import React, { useEffect, useState } from "react";
import ShopCard from "../../partials/admin/ShopCard";
// import WeeklyOverview from "../partials/dashboard/WeeklyOverview";
// import TopProducts from "../partials/dashboard/TopProducts";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import { checkLogin } from "../../utils/Utils";
import apiClient from "../../apiClient";
import { useNavigate } from "react-router-dom";

function Dashboard({ sidebarOpen, setSidebarOpen }) {
  const [shops, setShops] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const userRole = checkLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole != "admin") {
      navigate("/");
    }
    apiClient.get("store/").then((res) => {
      setShops(res.data);
      setTodayTotal(res.data.reduce((acc, shop) => acc + shop.today_total, 0));
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
                Admin Dashboard
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Filter button */}
              {/* <FilterButton align="right" /> */}
              {/* Datepicker built with flatpickr */}
              {/* <Datepicker align="right" /> */}
              {/* Add view button */}
              <p className="text-sm">
                Total Earnings Today:{" "}
                <span className="text-green-800 font-bold">
                  GHC {todayTotal.toFixed(2)}
                </span>{" "}
              </p>
            </div>
          </div>

          <p className="uppercase text-sm font-semibold mb-2">My shops</p>
          {/* Cards */}
          <div className="grid grid-cols-12 gap-6">
            {/* <DailyProgress
              today={todayTotal}
              yesterday={yesterdayTotal}
              dailyTarget={dailyTarget}
            /> */}
            {/* <WeeklyOverview
              weeklyTotal={weeklyTotal}
              dateLabels={dateLabels}
              dailyTotals={dailyTotals}
            /> */}
            {shops.map((shop) => (
              <ShopCard
                key={shop.id}
                shopId={shop.id}
                name={shop.name}
                staffId={shop.staff_id}
                todayTotal={shop.today_total}
                dailyTarget={shop.daily_target}
                weekTotal={shop.week_total}
                overAllTotal={shop.overall_total}
              />
            ))}
            {/* <TopProducts products={topProducts} /> */}
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
