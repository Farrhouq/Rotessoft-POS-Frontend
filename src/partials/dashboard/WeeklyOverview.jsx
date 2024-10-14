import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import LineChart from "../../charts/LineChart01";
import { chartAreaGradient } from "../../charts/ChartjsConfig";
import EditMenu from "../../components/DropdownEditMenu";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";

function WeeklyOverView({ weeklyTotal, dateLabels, dailyTotals }) {
  const chartData = {
    labels: dateLabels,
    datasets: [
      {
        data: dailyTotals,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return chartAreaGradient(ctx, chartArea, [
            {
              stop: 0,
              color: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 0)`,
            },
            {
              stop: 1,
              color: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 0.2)`,
            },
          ]);
        },
        borderColor: tailwindConfig().theme.colors.violet[500],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.violet[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-7 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Week Overview
          </h2>
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link
                className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
                to="#0"
              >
                Option 1
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
                to="#0"
              >
                Option 2
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3"
                to="#0"
              >
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Total
        </div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            ₵{weeklyTotal}
          </div>
          {/* <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">
            -14%
          </div> */}
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] max-h-[128px]">
        {/* Render chart only when data is available */}
        {dateLabels.length > 0 && dailyTotals.length > 0 ? (
          <LineChart data={chartData} width={389} height={128} />
        ) : (
          <p className="text-center mt-12">Loading chart data...</p> // Fallback content while waiting for data
        )}
      </div>
    </div>
  );
}

export default WeeklyOverView;
