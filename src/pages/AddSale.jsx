import React, { useState, useEffect } from "react";
import Select from "react-select";
import apiClient from "../apiClient";
import toaster from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addRequestToQueue, processQueue } from "../utils/requestQueue";
import { checkLogin } from "../utils/Utils";
import { filterSales, mergeAndSortSales } from "../utils/sales";
import { updateDashboardTotalSalesToday } from "../utils/dashboard";
import { v4 as uuidv4 } from "uuid";

function AddSale() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const shopId = localStorage.getItem("shopId");
  const [customerName, setCustomerName] = useState("");
  const [currentSale, setCurrentSale] = useState({
    product: "",
    quantity: "",
    id: "",
  });
  const [products, setProducts] = useState([]);
  const userRole = checkLogin();

  useEffect(() => {
    if (!shopId && userRole != "staff") navigate("/");
    const productsUrl =
      userRole === "staff" ? "product/" : `product/?store=${shopId}`;
    if (localStorage.getItem("products")) {
      setProducts(JSON.parse(localStorage.getItem("products")));
    } else {
      apiClient.get(productsUrl).then((res) => {
        setProducts(res.data);
        localStorage.setItem("products", JSON.stringify(res.data));
      });
    }
  }, []);

  function extractFirstPart(label) {
    // Define the exact separator
    const separator = "---------------------";

    // Split the label by the exact separator
    let parts = label.split(separator);

    // The first part before the separator
    let firstPart = parts[0].trim();

    return firstPart;
  }

  const handleInputChange = (e) => {
    const { value, label } = e;
    setCurrentSale({
      product: extractFirstPart(label),
      quantity: currentSale.quantity,
      id: value,
    });
    // let p = products.find((p) => p.name === extractFirstPart(label));
    // console.log(p);
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
    // Update the products state
    let localProducts = JSON.parse(localStorage.getItem("products"));
    let product = localProducts.find((product) => product.id === id);
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
    const salesUrl = userRole === "staff" ? "sale/" : `sale/?store=${shopId}`;

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
    let saleId = uuidv4();
    addRequestToQueue("POST", salesUrl, {
      sales,
      created_at: new Date(),
      id: saleId,
      customer_name: customerName,
    });
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
      id: saleId,
    };
    localSales.push(newSale);
    localStorage.setItem("sales", JSON.stringify(localSales));
    processQueue().finally(() => {
      setSales([]);
      toaster.success("Sale saved");

      // Fetch sales again to update the sales list
      apiClient
        .get(salesUrl)
        .then((res) => {
          let localSales = JSON.parse(localStorage.getItem("sales"));
          let allSales = mergeAndSortSales(res.data, localSales || []);
          // setSales(allSales);
          localStorage.setItem("sales", JSON.stringify(allSales));
          let today = res.data.reduce((acc, sale) => acc + sale.total, 0);
          localStorage.setItem("todayTotal", today);
          updateDashboardTotalSalesToday(today);
        })
        .catch((res) => {
          if (res.code == "ERR_NETWORK") {
            toaster.error("You're offline. Sales will sync when online."); // might remove this code. Or add info like: Sales will sync when you're online. But I just don't want to make the place messy. Also I want to make it seamless.
            // do the offline updates here to the dashboard as well
            let localSales = JSON.parse(localStorage.getItem("sales"));
            let todaySales = filterSales(localSales, 0);
            let today = todaySales.reduce((acc, sale) => acc + sale.total, 0);
            updateDashboardTotalSalesToday(today);
          } else {
            toaster.error("An error occurred. Please try again.");
          }
        });
      //

      if (!receipt) {
        // setSales([]);
        // setCurrentSale({
        //   product: "",
        //   quantity: "",
        //   id: "",
        // });
        // window.location.reload();
        navigate("/sales/");
      } else navigate("/print/", { state: { savedSale: sales } });
    });
  };

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
                label: `${product.name} --------------------- ${product.amount_in_stock}`,
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

        {/* p tag showing the amount in stock of the selected product */}
        <p className="text-gray-700 font-semibold mb-5 dark:text-gray-300">
          {currentSale.product
            ? `Amount in stock: ${
                products.find((p) => p.name === currentSale.product)
                  .amount_in_stock
              }`
            : ""}
        </p>

        {/* give me an input field */}
        {sales.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              name="customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
              className="w-full bg-white text-black border-gray-300 dark:border-gray-700 rounded-md p-2"
            />
          </div>
        )}
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

        <div className="mt-6 flex justify-between sm:flex-row  flex-col items-start sm:items-center gap-4">
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
