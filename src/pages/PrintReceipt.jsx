import React, { useState, useEffect } from "react";
import Select from "react-select";
import apiClient from "../apiClient";
import toaster from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { addRequestToQueue, processQueue } from "../utils/requestQueue";
import { generateSaleID, printReceipt } from "../utils/sale-detail";

function PrintReceipt() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const { savedSale } = location.state || {};
  if (!savedSale) {
    navigate("/sales/");
    return;
  }
  const [customerName, setCustomerName] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("products")) {
      setProducts(JSON.parse(localStorage.getItem("products")));
    } else {
      apiClient.get("product/").then((res) => {
        setProducts(res.data);
        localStorage.setItem("products", JSON.stringify(res.data));
      });
    }
  }, []);

  // when they press enter, it should auto go to the next input, then finally the print button
  function handleKeyDown(e) {
    const focusArray = [
      document.querySelector("input#customerName"),
      document.querySelector("input#amountPaid"),
      document.querySelector("button#printReceipt"),
    ];

    if (e.key === "Enter") {
      e.preventDefault();
      const index = Array.prototype.indexOf.call(focusArray, e.target);
      focusArray[index + 1].focus();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex-1 mb-4 md:mb-0">
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              autoFocus={true}
              onKeyDown={handleKeyDown}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block dark:text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex-1 mb-4 md:mb-0">
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount Paid (GH₵)
            </label>
            <input
              type="number"
              onKeyDown={handleKeyDown}
              id="amountPaid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="mt-1 dark:text-black block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        {/* table */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {savedSale.map((saleProduct) => {
                const product = products.find(
                  (p) => p.name === saleProduct.product,
                );
                const price = product ? product.selling_price : 0;
                const total = price * saleProduct.quantity;
                return (
                  <tr key={saleProduct.id}>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      {saleProduct.product}
                    </td>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      {saleProduct.quantity}
                    </td>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      ₵{price.toFixed(2)}
                    </td>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      ₵{total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* for mobile */}
        <div className="md:hidden flex flex-col">
          {savedSale.map((saleProduct) => {
            const product = products.find(
              (p) => p.name === saleProduct.product,
            );
            const price = product ? product.selling_price : 0;
            const total = price * saleProduct.quantity;
            return (
              <div
                key={saleProduct.product}
                className="rounded-md flex justify-between bg-gray-50 dark:bg-gray-800 p-4 mt-4 shadow-md"
              >
                <div className="w-[70%]">
                  <p className="w-full flex justify-between">
                    {" "}
                    <span>Product: </span>{" "}
                    <span className="font-bold">{saleProduct.product}</span>{" "}
                  </p>
                  <p className="w-full flex justify-between">
                    {" "}
                    <span>Quantity: </span>{" "}
                    <span className="font-bold">{saleProduct.quantity}</span>{" "}
                  </p>
                  <p className="w-full flex justify-between">
                    {" "}
                    <span>Price: </span>{" "}
                    <span className="font-bold">{price}</span>{" "}
                  </p>
                  <p className="w-full flex justify-between">
                    {" "}
                    <span>Total: </span>{" "}
                    <span className="font-bold">{total}</span>{" "}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="text-xl font-semibold flex justify-between gap-7">
            <span>Total Price:</span>
            <span>
              ₵
              {savedSale.reduce((acc, curr) => {
                const product = products.find((p) => p.name === curr.product);
                const price = product ? product.selling_price : 0;
                return acc + price * curr.quantity;
              }, 0)}
            </span>
          </div>
          <button
            onClick={() =>
              printReceipt(savedSale, products, customerName, amountPaid)
            }
            id="printReceipt"
            className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 flex items-center"
          >
            Print Receipt
          </button>

          {/* a big text to show the customers balance */}
        </div>
        <div className="text-xl font-semibold flex w-[16%] justify-between gap-7 mt-10">
          <span>Balance:</span>
          <span className="text-red-800">
            ₵
            {amountPaid -
              savedSale.reduce((acc, curr) => {
                const product = products.find((p) => p.name === curr.product);
                const price = product ? product.selling_price : 0;
                return acc + price * curr.quantity;
              }, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PrintReceipt;
