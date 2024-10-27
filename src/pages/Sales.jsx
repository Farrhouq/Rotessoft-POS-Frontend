import { Link } from "react-router-dom";
import SalesTable from "../partials/sales/SalesTable";
import api from "../apiClient";
import { useEffect, useState } from "react";
import { checkLogin } from "../utils/Utils";
import { addRequestToQueue, processQueue } from "../utils/requestQueue";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const userRole = checkLogin();
  const shopId = localStorage.getItem("shopId");

  // processQueue();

  const fetchSales = async (role) => {
    if (role == "staff")
      return api.get("sale/").then((res) => {
        setSales(res.data);
        localStorage.setItem("sales", JSON.stringify(res.data));
        let today = res.data.reduce((acc, sale) => acc + sale.total, 0);
        localStorage.setItem("todayTotal", today);
      });
    else {
      return api.get(`sale/?store=${shopId}`).then((res) => {
        setSales(res.data);
        localStorage.setItem("sales", JSON.stringify(res.data));
        let today = res.data.reduce((acc, sale) => acc + sale.total, 0);
        localStorage.setItem("todayTotal", today);
      });
    }
  };

  useEffect(() => {
    let localSales = localStorage.getItem("sales");
    if (localSales) setSales(JSON.parse(localSales));
    fetchSales(userRole).catch(() => {
      setSales(JSON.parse(localSales));
    });
  }, []);

  const dailyTarget = localStorage.getItem("dailyTarget");
  const today = localStorage.getItem("todayTotal") || 0;
  if (!today) localStorage.setItem("todayTotal", 0);
  const percentProgress = (today / dailyTarget) * 100;

  return (
    <main className="grow">
      <div className="sm:px-6 lg:px-8 py-8 p-4 w-full max-w-9xl mx-auto">
        <div className="flex justify-between">
          <div className="flex gap-1 mb-6">
            <div className="text-3xl font-bold flex flex-col gap-2 items-start">
              <p> Today's Sales</p>
              <div className="flex items-center">
                <span className="mr-1 ml-2 text-[18px]">Gh₵</span>
                <span className="text-green-700">{(+today).toFixed(2)}</span>
                <span
                  className={`${percentProgress >= 100 ? `text-green-700 bg-green-500/20` : `text-red-700 bg-red-500/20`} ml-3 text-sm font-lg font-bold w-fit px-2 py-1 rounded-full`}
                >
                  {percentProgress.toFixed()}%
                </span>
              </div>
            </div>
          </div>
          {
            <Link to="/sales/add/">
              <button className="btn h-fit bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                <svg
                  className="fill-current shrink-0 xs:hidden"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="max-xs:sr-only">Add Sale</span>
              </button>
            </Link>
          }
        </div>
        <SalesTable sales={sales} />
      </div>
    </main>
  );
};

export default Sales;
