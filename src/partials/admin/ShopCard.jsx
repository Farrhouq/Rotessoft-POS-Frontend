import React from "react";
import { Link } from "react-router-dom";
// import LineChart from "../../charts/LineChart01";
// import { chartAreaGradient } from "../../charts/ChartjsConfig";
import EditMenu from "../../components/DropdownEditMenu";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

function ShopCard({
  name,
  todayTotal,
  dailyTarget,
  weekTotal,
  overAllTotal,
  shopId,
  staffId,
}) {
  // const increasePercentage = ((today - yesterday) / yesterday) * 100;
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-5 bg-white dark:bg-gray-800 shadow-sm rounded-xl px-2 md:px-5 pb-8">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {name}
          </h2>
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link
                onClick={() => {
                  localStorage.setItem("shopId", shopId);
                }}
                className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
                to="#0"
              >
                Enter Shop
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  localStorage.setItem("staffId", staffId);
                  localStorage.setItem("shopId", shopId);
                }}
                className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
                to="/admin/shop/staff/"
              >
                Employee
              </Link>
            </li>
            {/* <li>
              <Link
                className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3"
                to="#0"
              >
                Remove
              </Link>
            </li> */}
          </EditMenu>
        </header>
        {/* Chart built with Chart.js 3 */}
        <div className="grow max-sm:max-h-[128px] xl:max-h-[155px] font-bold flex w-full justify-between flex-nowrap items-start">
          {/* Change the height attribute to adjust the chart height */}
          <div className="w-[40%] h-fit">
            <CircularProgressbar
              styles={buildStyles({
                fontFamily: "",
                textSize: "16px",
                pathColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 1)`,
                trailColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.gray[600])}, 0.1)`,
              })}
              value={(todayTotal * 100) / dailyTarget}
              text={`${(todayTotal * 100) / dailyTarget}%`}
              strokeWidth={15}
            />
          </div>
          <div className="flex flex-col gap-2 mt-6 text-sm w-[45%]">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-violet-500 rounded-full mr-2"></div>
              <p className="text-gray-500 dark:text-gray-400">
                Today: {todayTotal}
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
              <p className="text-gray-500 dark:text-gray-600">
                Target: {dailyTarget}
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-gray-400 mt-5 dark:text-gray-500 uppercase mb-1">
          Stats
        </div>
        <div className="flex flex-col items-start">
          {/* <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            ₵{today}.00
          </div>
          <div
            className={`text-sm font-medium ${increasePercentage > 0 ? `text-green-700 bg-green-500/20` : `text-red-700 bg-red-500/20`}  px-1.5 rounded-full`}
          >
            {`${increasePercentage > 0 ? `+` : ``}`}
            {increasePercentage.toFixed()}%
          </div> */}
          <div className="flex justify-between w-[92%]">
            <span>Today's Earnings:</span>
            <span className="text-green-800 font-bold">{todayTotal}</span>
          </div>
          <div className="flex justify-between w-[92%]">
            <span>Week Total:</span>
            <span className="text-green-800 font-bold">{weekTotal}</span>
          </div>
          <div className="flex justify-between w-[92%]">
            <span>Total Earnings:</span>
            <span className="text-green-800 font-bold">{overAllTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopCard;
