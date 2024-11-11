import { Link } from "react-router-dom";
import SalesTable from "../partials/sales/SalesTable";
import api from "../apiClient";
import { useEffect, useState } from "react";
import { checkLogin } from "../utils/Utils";
import { addRequestToQueue, processQueue } from "../utils/requestQueue";
import DateNavigator from "../components/DateNavigator";
import { mergeAndSortSales } from "../utils/sales";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const userRole = checkLogin();
  const shopId = localStorage.getItem("shopId");
  const [offset, setOffset] = useState(0);
  const [currentSales, setCurrentSales] = useState([]);
  const [currentDayTotal, setCurrentDayTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // processQueue();

  function filterSales(sales, range_1, range_2 = range_1) {
    if (range_2 < range_1) {
      throw new Error("range_2 must be greater than or equal to range_1");
    }

    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);

    // Set date boundaries
    startDate.setDate(today.getDate() - range_2);
    startDate.setHours(0, 0, 0, 0); // Start of the day
    endDate.setDate(today.getDate() - range_1);
    endDate.setHours(23, 59, 59, 999); // End of the day

    return sales.filter((sale) => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }

  const fetchSales = async (role) => {
    console.log("fetching sales");
    setLoading(true);
    const salesUrl = role == "staff" ? "sale/" : `sale/?store=${shopId}`;
    return api.get(salesUrl).then((res) => {
      console.log("fetched sales successfully");
      setLoading(false);
      setSales(mergeAndSortSales(res.data, []));
      localStorage.setItem("sales", JSON.stringify(res.data));
      let today = res.data.reduce((acc, sale) => acc + sale.total, 0);
      localStorage.setItem("todayTotal", today);
    });
  };

  useEffect(() => {
    let localSales = localStorage.getItem("sales") || "[]";
    if (localSales) setSales(mergeAndSortSales(JSON.parse(localSales), []));
    fetchSales(userRole).catch((res) => {
      setLoading(false);
      setSales(mergeAndSortSales(JSON.parse(localSales), []));
    });
  }, [shopId, userRole]);

  useEffect(() => {
    if (offset > 1) {
      setOffset(0); // redirect back to today
      return;
    }
    let role = checkLogin();
    let salesUrl =
      role == "staff"
        ? `sale/?offset=${offset}`
        : `sale/?store=${shopId}&offset=${offset}`;
    if (offset === 0) {
      let localSales = JSON.parse(localStorage.getItem("sales")) || [];
      let filteredSales = filterSales(localSales, 0);
      setCurrentSales(mergeAndSortSales(filteredSales, []));
      setCurrentDayTotal(
        filteredSales.reduce((acc, sale) => acc + sale.total, 0),
      );
      return;
    }
    setLoading(true);
    api.get(salesUrl).then((res) => {
      setLoading(false);
      setCurrentSales(mergeAndSortSales(res.data, []));
      setCurrentDayTotal(res.data.reduce((acc, sale) => acc + sale.total, 0));
    });
  }, [sales, offset]);

  const dailyTarget = localStorage.getItem("dailyTarget");
  const today = localStorage.getItem("todayTotal") || 0;
  if (!today) localStorage.setItem("todayTotal", 0);
  const percentProgress = (today / dailyTarget) * 100;

  return (
    <main className="grow">
      <div className="sm:px-6 lg:px-8 py-8 p-4 w-full max-w-9xl mx-auto">
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <div className="flex gap-1">
            <div className="text-3xl font-bold flex flex-col gap-2 items-start">
              <p>
                Sales
                <svg
                  onClick={() => fetchSales(userRole)}
                  className={`w-9 rounded-xl ${loading && `animate-spin`} ml-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 inline-block fill-purple-600 dark:fill-purple-400`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                </svg>
              </p>
              <div className="flex items-center">
                <span className="mr-1 ml-2 text-[18px]">Gh₵</span>
                <span className="text-green-700">
                  {(+currentDayTotal).toFixed(2)}
                </span>
                <span
                  className={`${percentProgress >= 100 ? `text-green-700 bg-green-500/20` : `text-red-700 bg-red-500/20`} ml-3 text-sm font-lg font-bold w-fit px-2 py-1 rounded-full`}
                >
                  {((currentDayTotal * 100) / dailyTarget).toFixed()}%
                </span>
              </div>
            </div>
          </div>
          <DateNavigator offset={offset} setOffset={setOffset} />
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
        </div>
        <SalesTable
          sales={[...currentSales].reverse() /* to display the latest first */}
          loading={loading}
        />
      </div>
    </main>
  );
};

export default Sales;
