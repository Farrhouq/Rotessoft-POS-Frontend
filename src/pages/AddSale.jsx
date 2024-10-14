import React, { useState, useEffect } from "react";
import Select from "react-select";
import apiClient from "../apiClient";
import toaster from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
    console.log(e);
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
    console.log(currentSale);
    if (currentSale.product && currentSale.quantity) {
      setSales((prev) => [...prev, currentSale]);
      setCurrentSale({ product: "", quantity: "", id: "" });
    }
  };

  const deleteSale = (id) => {
    setSales((prev) => prev.filter((sale) => sale.id !== id));
  };

  const saveSales = () => {
    if (!sales.length) return;
    apiClient.post("sale/", { sales }).then((res) => {
      setSales([]);
      setCurrentSale({ product: "", quantity: "", id: "" });
      let dailyTotals = JSON.parse(localStorage.getItem("dailyTotals"));
      let todayTotal = dailyTotals.pop();
      todayTotal += res.data.total;
      console.log(todayTotal);
      dailyTotals.push(todayTotal);
      localStorage.setItem("dailyTotals", JSON.stringify(dailyTotals));
      navigate("/sales/");
      toaster.success("Sale saved");
    });
  };

  const totalPrice = sales.reduce((sum, sale) => {
    const product = products.find((p) => p.name === sale.product);
    return sum + (product ? product.price * sale.quantity : 0);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {/* Action */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sales.map((sale) => {
                const product = products.find((p) => p.name === sale.product);
                const price = product ? product.price : 0;
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
                      ${price.toFixed(2)}
                    </td>
                    <td className="px-6 text py-4 whitespace-nowrap">
                      ${total.toFixed(2)}
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
        <div className="md:hidden flex flex-col">
          {sales.map((sale) => {
            const product = products.find((p) => p.name === sale.product);
            const price = product ? product.price : 0;
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
            Total Price: ${totalPrice.toFixed(2)}
          </div>
          <button
            onClick={saveSales}
            className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSale;
