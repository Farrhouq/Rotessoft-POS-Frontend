import { Link } from "react-router-dom";
import SalesTable from "../partials/sales/SalesTable";
import api from "../apiClient";
import { useEffect, useState } from "react";
import { checkLogin } from "../utils/Utils";

const Sales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api.get("sale/").then((res) => {
      setSales(res.data);
    });
  }, []);

  return (
    <main className="grow">
      <div className="sm:px-6 lg:px-8 py-8 p-4 w-full max-w-9xl mx-auto">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">Today's Sales</h1>
          {/* a button for add sales. white with black text */}
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
        <SalesTable sales={sales} />
      </div>
    </main>
  );
};

export default Sales;
