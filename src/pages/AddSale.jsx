import React, { useState, useEffect } from "react";
import Select from "react-select";
import apiClient from "../apiClient";
import toaster from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addRequestToQueue, processQueue } from "../utils/requestQueue";

function AddSale() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [currentSale, setCurrentSale] = useState({
    product: "",
    quantity: "",
    id: "",
  });
  const [products, setProducts] = useState([]);

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

  const handleInputChange = (e) => {
    const { value, label } = e;
    // console.log(e);
    setCurrentSale({
      product: label,
      quantity: currentSale.quantity,
      id: value,
    });
  };

  const handleQtyChange = (e) => {
    const qty = e.target.value;
    setCurrentSale({
      product: currentSale.product,
      quantity: qty,
      id: currentSale.id,
    });
  };

  const addSale = () => {
    if (currentSale.product && currentSale.quantity) {
      setSales((prev) => [...prev, currentSale]);
      setCurrentSale({ product: "", quantity: "", id: "" });
    }
  };

  const updateStock = (id, toSubtract) => {
    console.log("updating stock...");
    // Update the products state
    let localProducts = JSON.parse(localStorage.getItem("products"));
    let product = localProducts.find((product) => product.id === id);
    console.log(product, "product_found...");
    if (product.amount_in_stock < toSubtract) {
      toaster.error(`Not enough stock for product ${product.name}`);
      return null;
    }
    const newProducts = localProducts.map((product) =>
      product.id === id
        ? { ...product, amount_in_stock: product.amount_in_stock - toSubtract }
        : product,
    );
    localStorage.setItem("products", JSON.stringify(newProducts));
    return newProducts;
  };

  const deleteSale = (id) => {
    setSales((prev) => prev.filter((sale) => sale.id !== id));
  };

  const calculateTotal = () => {
    let total = 0;
    for (let sale of sales) {
      const product = products.find((p) => p.id === sale.id);
      total += product.selling_price * sale.quantity;
    }
    return total;
  };

  const saveSales = (receipt) => {
    if (!sales.length) return;
    setCurrentSale({ product: "", quantity: "", id: "" });
    let todayTotal = +localStorage.getItem("todayTotal") + calculateTotal();
    localStorage.setItem("todayTotal", todayTotal);
    let error = false;
    let newProducts;
    let oldProducts = JSON.parse(localStorage.getItem("products"));
    for (let sale of sales) {
      newProducts = updateStock(sale.id, sale.quantity);
      if (!newProducts) {
        error = true;
        break;
      }
    }
    if (error) {
      localStorage.setItem("products", JSON.stringify(oldProducts));
      return;
    }

    addRequestToQueue("POST", "sale/", { sales });
    let localSales = JSON.parse(localStorage.getItem("sales"));
    let saleStr = "";
    for (let s of sales) {
      saleStr += s.product;
      if (sales.indexOf(s) != sales.length - 1) saleStr += ", ";
    }
    let newSale = {
      created_at: new Date(),
      __str__: saleStr,
      total: calculateTotal(),
    };
    localSales.unshift(newSale);
    localStorage.setItem("sales", JSON.stringify(localSales));
    processQueue().finally(() => {
      setSales([]);
      toaster.success("Sale saved");

      //
      apiClient
        .get("sale/")
        .then((res) => {
          setSales(res.data);
          localStorage.setItem("sales", JSON.stringify(res.data));
          let today = res.data.reduce((acc, sale) => acc + sale.total, 0);
          localStorage.setItem("todayTotal", today);
        })
        .catch(() => {
          toaster.error("You're offline. Sales will sync when online."); // might remove this code. Or add info like: Sales will sync when you're online. But I just don't want to make the place messy. Also I want to make it seamless.
        });
      //

      if (!receipt) navigate("/sales/");
      else navigate("/sale-detail/", { state: { savedSale: sales } });
    });
  };

  function printReceipt() {
    const receiptContent = `
          <html>
              <head>
                  <style>
                      /* Custom styles for the receipt */
                      body {
                          font-family: Arial, sans-serif;
                          margin: 0;
                          padding: 0;
                          width: 80mm; /* Set to receipt width */
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
                          font-size: 12px;
                      }
                      .receipt .total {
                          text-align: right;
                          margin-top: 10px;
                      }
                      .receipt .total .amount {
                          font-weight: bold;
                      }
                  </style>
              </head>
              <body>
                  <div class="receipt">
                      <div class="header">
                          <h1>Parinjani Mobile Technology</h1>
                          <p>(Dealers in Mobile Phones, Accessories, etc.)</p>
                          <p>Locate Us: Dakpema Roundabout, Tamale-Accra Road</p>
                          <p>Tel: 024 4 885 589 | 0209 252 462</p>
                      </div>
                      <p>Cashier: UNIVERSAL MAN</p>
                      <p>Customer: SHERIF</p>
                      <table class="items">
                          <thead>
                              <tr>
                                  <th>#</th>
                                  <th>Item Name</th>
                                  <th>Qty</th>
                                  <th>Price</th>
                                  <th>Total</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>1</td>
                                  <td>TECNO POP 9 (64)</td>
                                  <td>1</td>
                                  <td>300.00</td>
                                  <td>1,300.00</td>
                              </tr>
                              <tr>
                                  <td>2</td>
                                  <td>PROTECTOR</td>
                                  <td>1</td>
                                  <td>20.00</td>
                                  <td>20.00</td>
                              </tr>
                          </tbody>
                      </table>
                      <div class="total">
                          <p>Purchase Total: GH₵ 1,320.00</p>
                          <p>Amount Paid: GH₵ 1,350.00</p>
                          <p>Change: GH₵ 30.00</p>
                          <p class="amount">Total Due: GH₵ 0.00</p>
                      </div>
                      <div class="footer">
                          <p>We will serve you!</p>
                          <p>Date: 10/25/2024 9:31:42 PM</p>
                          <p>MoMo Number: 055 7960 396</p>
                      </div>
                  </div>
              </body>
          </html>
      `;

    const printWindow = window.open("", "_blank", "width=300,height=600");
    printWindow.document.open();
    printWindow.document.write(receiptContent);
    printWindow.document.close();

    // Wait a bit for the content to load, then print and close the window
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  }

  const totalPrice = sales.reduce((sum, sale) => {
    const product = products.find((p) => p.name === sale.product);
    return sum + (product ? product.selling_price * sale.quantity : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">New sale</h1>

        <div className="mb-6 flex flex-wrap gap-2 justify-between">
          <div className="w-[67%] md:w-[60%]">
            <Select
              className="dark:bg-gray-800"
              options={products.map((product) => ({
                value: product.id,
                label: product.name,
              }))}
              onChange={(e) => handleInputChange(e)}
              styles={{
                input: (base) => ({
                  ...base,
                  "input:focus": {
                    boxShadow: "none",
                  },
                }),
                option: (base) => ({
                  ...base,
                  color: "black",
                }),
              }}
            />
          </div>
          <input
            type="number"
            name="quantity"
            min="1"
            value={currentSale.quantity}
            onChange={handleQtyChange}
            placeholder="Quantity"
            className="w-[30%] bg-white text-black border border-gray-300 dark:border-gray-700 rounded-md"
          />
          <button
            onClick={addSale}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
            </svg>
            Add
          </button>
        </div>

        {/* table */}
        <div
          id="receipt"
          className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {/* Action */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sales.map((sale) => {
                const product = products.find((p) => p.name === sale.product);
                const price = product ? product.selling_price : 0;
                const total = price * sale.quantity;
                return (
                  <tr key={sale.id}>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      {sale.product}
                    </td>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      {sale.quantity}
                    </td>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      ₵{price.toFixed(2)}
                    </td>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      ₵{total.toFixed(2)}
                    </td>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      <svg
                        onClick={() => deleteSale(sale.id)}
                        style={{ fill: "#e63746" }}
                        className="w-4 text-red-600 fill-red-300 hover:text-red-900 dark:hover:text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* for mobile */}
        <div id="receipt" className="md:hidden flex flex-col">
          {sales.map((sale) => {
            const product = products.find((p) => p.name === sale.product);
            const price = product ? product.selling_price : 0;
            const total = price * sale.quantity;
            return (
              <div
                key={sale.product}
                className="rounded-md flex justify-between bg-gray-50 dark:bg-gray-800 p-4 mt-4 shadow-md"
              >
                <div className="w-[70%]">
                  <p className="w-full flex justify-between">
                    {" "}
                    <span>Product: </span>{" "}
                    <span className="font-bold">{sale.product}</span>{" "}
                  </p>
                  <p className="w-full flex justify-between">
                    {" "}
                    <span>Quantity: </span>{" "}
                    <span className="font-bold">{sale.quantity}</span>{" "}
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

                <div className="px-6 text py-4 whitespace-nowrap border-l">
                  <svg
                    onClick={() => deleteSale(sale.id)}
                    style={{ fill: "#e63746" }}
                    className="w-4 text-red-600 fill-red-300 hover:text-red-900 dark:hover:text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-xl font-semibold">
            Total Price: ₵{totalPrice.toFixed(2)}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => saveSales(false)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
              </svg>
              Save
            </button>

            <button
              onClick={() => saveSales(true)}
              className="bg-green-700 hover:bg-green-600 text-white rounded-md px-4 py-2 flex items-center"
            >
              Save and print receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSale;
