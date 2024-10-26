import React, { useState, useEffect } from "react";
import Select from "react-select";
import apiClient from "../apiClient";
import toaster from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { addRequestToQueue, processQueue } from "../utils/requestQueue";

function SaleDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const { savedSale } = location.state || {};
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

  function printReceipt() {
    if (!amountPaid || !customerName) return;
    const totalPrice = savedSale.reduce((acc, curr) => {
      const product = products.find((p) => p.name === curr.product);
      const price = product ? product.selling_price : 0;
      return acc + price * curr.quantity;
    }, 0);
    const receiptContent = `
        <html>
          <head>
              <style>
                  /* Custom styles for the receipt */
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      width: 40mm; /* Set to receipt width */
                  }
                  .receipt {
                      padding: 10px;
                      font-size: 6px;
                      line-height: 1.4;
                  }
                  .receipt h1, .receipt h2, .receipt p {
                      margin: 0;
                      text-align: center;
                  }
                  .receipt .header, .receipt .footer {
                      text-align: center;
                      margin-bottom: 10px;
                  }
                  .receipt .items {
                      width: 100%;
                      margin-top: 10px;
                  }
                  .receipt .items th, .receipt .items td {
                      text-align: left;
                      padding: 5px;
                      font-size: 6px;
                  }
                  .receipt .total {
                      text-align: right;
                      margin-top: 10px;
                  }
                  .receipt .total .amount {
                      font-weight: bold;
                  }

                  .amount-container {
                      display: flex;
                      justify-content: space-between;
                      width: 100%;
                  }
                  .sale-summary {
                      font-weight: bold;
                      text-decoration: underline
                  }
              </style>
          </head>
          <body>
              <div class="receipt">
                  <div class="header">
                      <h1>Parinjani Mobile Technology</h1>
                      <p>(Dealers in Mobile Phones, Accessories, Decoding, Flashing, Repairing, Downloading Tones, CD Printing, Lamination, Design of Cards)</p>
                      <p>Locate Us: Dakpema Roundabout, Tamale-Accra Road</p>
                      <p>Tel: 0244 885 589 | 0209 252 462</p>
                  </div>
                  <p>Cashier: UNIVERSAL MAN</p>
                  <p>Customer: ${customerName}</p>
                  <div class="items">
                    <table style="width: 100%;">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${savedSale
                          .map((saleProduct) => {
                            const product = products.find(
                              (p) => p.name === saleProduct.product,
                            );
                            const price = product ? product.selling_price : 0;
                            const total = price * saleProduct.quantity;
                            return `
                            <tr>
                              <td>${saleProduct.product}</td>
                              <td>${saleProduct.quantity}</td>
                              <td>₵${price.toFixed(2)}</td>
                              <td>₵${total.toFixed(2)}</td>
                            </tr>`;
                          })
                          .join("")}
                      </tbody>
                    </table>
                  </div>
                  <hr >
                  <p class="sale-summary">Sale Summary (GH₵)</p>
                  <div class="total" style="display: flex; justify-content: flex-start; align-items: flex-start; gap: 2px; flex-direction: column">
                      <p class="amount-container"><span class="amount"> Purchase Total: </span> <span>${totalPrice.toFixed(2)}</span></p>
                      <p class="amount-container"><span class="amount">Amount Paid: </span> <span>${Number(amountPaid).toFixed(2)}</span></p>
                      <p class="amount-container"><span class="amount">Change: </span> <span>${(amountPaid - totalPrice).toFixed(2) > 0 ? (amountPaid - totalPrice).toFixed(2) : `0.00`}</span></p>
                      <p class="amount-container"><span class="amount">Total Due: </span> <span>${(totalPrice - amountPaid).toFixed(2) > 0 ? (totalPrice - amountPaid).toFixed(2) : `0.00`}</span></p>
                  </div>
                  <div class="footer" style="margin-top: 10px;">
                      <p>Date: ${new Date().toLocaleString()}</p>
                      <p>MoMo Number: 055 7960 396</p>
                  </div>
                  <p style="font-style: italic; margin-bottom: 6px;">Thank you for your patronage, dear customer</p>
              </div>
          </body>
        </html>
      `;

    const printWindow = window.open("", "_blank", "width=420,height=600"); // Adjusted width
    printWindow.document.open();
    printWindow.document.write(receiptContent);
    printWindow.document.close();

    // Wait a bit for the content to load, then print and handle the print dialog
    printWindow.onload = () => {
      // setTimeout(() => {
      printWindow.print();
      // }, 400);

      // Close the window after the print dialog is closed (whether successful or canceled)
      printWindow.onafterprint = () => {
        console.log("after print");
        printWindow.close();
      };

      // // Optional: Use a timer to ensure the print window closes after a while
      // setTimeout(() => {
      //   if (printWindow) {
      //     printWindow.close(); // Close window after timeout
      //   }
      // }, 10000); // Adjust time as necessary
    };
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
          <div className="text-xl font-semibold">
            Total Price: ₵
            {savedSale.reduce((acc, curr) => {
              const product = products.find((p) => p.name === curr.product);
              const price = product ? product.selling_price : 0;
              return acc + price * curr.quantity;
            }, 0)}
          </div>
          <button
            onClick={printReceipt}
            className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 flex items-center"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaleDetail;
