import { Link } from "react-router-dom";
import SalesTable from "../partials/sales/SalesTable";
import api from "../apiClient";
import axios from "axios";
import { useEffect } from "react";

const Sales = () => {
  const sales = [
    // a list of objects with product, quantity, and price properties
    { product: "Github.com", quantity: 1, price: 3877, time: "10:00" },
    { product: "Facebook", quantity: 2, price: 3426, time: "11:00" },
    { product: "Google (organic)", quantity: 3, price: 2444, time: "12:00" },
    { product: "Vimeo.com", quantity: 4, price: 2236, time: "13:00" },
    { product: "Indiehackers.com", quantity: 5, price: 2034, time: "14:00" },
  ];

  useEffect(() => {
    api.get("sale/").then((res) => {
      console.log(res.data);
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
