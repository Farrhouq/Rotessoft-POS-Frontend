import React from "react";
import { Link, NavLink } from "react-router-dom";
import AddProductModal from "../../components/AddProductModal";
import RestockModal from "../../components/RestockModal";
import { useState } from "react";
import apiClient from "../../apiClient";

function Inventory({ userRole, products, setProducts }) {
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshProducts = () => {
    // setProducts([]);
    localStorage.removeItem("products");
    setLoading(true);
    if (userRole == "admin")
      apiClient
        .get(`product/?store=${localStorage.getItem("shopId")}`)
        .then((res) => {
          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    else
      apiClient
        .get(`product/`)
        .then((res) => {
          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex justify-between flex-col gap-2 md:flex-row">
          <h1 className="text-3xl font-bold mb-3">
            Products
            <svg
              onClick={refreshProducts}
              className={`w-9 rounded-xl ${loading && `animate-spin`} ml-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 inline-block fill-purple-600 dark:fill-purple-400`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
            </svg>
          </h1>
          {/* button group */}
          {userRole == "admin" && (
            <div className="flex gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setRestockModalOpen(!restockModalOpen);
                }}
              >
                <button className="btn h-fit bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">
                  <span className="">Restock</span>
                </button>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setAddProductModalOpen(!addProductModalOpen);
                }}
              >
                <button className="btn h-fit bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
                  <span className="">Add Product</span>
                </button>
              </div>
              <NavLink to="/admin/shop/edit-product/">
                <button className="btn h-fit bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
                  <span className="">Edit Product</span>
                </button>
              </NavLink>
              <AddProductModal
                modalOpen={addProductModalOpen}
                setModalOpen={setAddProductModalOpen}
                products={products}
                setProducts={setProducts}
              />
              <RestockModal
                modalOpen={restockModalOpen}
                setModalOpen={setRestockModalOpen}
                products={products}
                setProducts={setProducts}
              />
            </div>
          )}
        </div>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Product</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">
                    Amount in stock
                  </div>
                </th>
                {userRole == "staff" ? (
                  <th className="p-2">
                    <div className="font-semibold text-center">Price</div>
                  </th>
                ) : (
                  <>
                    <th className="p-2">
                      <div className="font-semibold text-center">
                        Cost price
                      </div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">
                        Selling price
                      </div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">
                        Profit per unit
                      </div>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="p-2">
                    <div className="flex items-center">
                      <svg
                        className="shrink-0 mr-2 sm:mr-3 w-4 fill-current text-violet-500 dark:text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M290.8 48.6l78.4 29.7L288 109.5 206.8 78.3l78.4-29.7c1.8-.7 3.8-.7 5.7 0zM136 92.5l0 112.2c-1.3 .4-2.6 .8-3.9 1.3l-96 36.4C14.4 250.6 0 271.5 0 294.7L0 413.9c0 22.2 13.1 42.3 33.5 51.3l96 42.2c14.4 6.3 30.7 6.3 45.1 0L288 457.5l113.5 49.9c14.4 6.3 30.7 6.3 45.1 0l96-42.2c20.3-8.9 33.5-29.1 33.5-51.3l0-119.1c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-1.3-.5-2.6-.9-3.9-1.3l0-112.2c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-12.8-4.8-26.9-4.8-39.7 0l-96 36.4C150.4 48.4 136 69.3 136 92.5zM392 210.6l-82.4 31.2 0-89.2L392 121l0 89.6zM154.8 250.9l78.4 29.7L152 311.7 70.8 280.6l78.4-29.7c1.8-.7 3.8-.7 5.7 0zm18.8 204.4l0-100.5L256 323.2l0 95.9-82.4 36.2zM421.2 250.9c1.8-.7 3.8-.7 5.7 0l78.4 29.7L424 311.7l-81.2-31.1 78.4-29.7zM523.2 421.2l-77.6 34.1 0-100.5L528 323.2l0 90.7c0 3.2-1.9 6-4.8 7.3z" />
                      </svg>
                      <div className="text-gray-800 dark:text-gray-100">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-center">{product.amount_in_stock}</div>
                  </td>
                  {userRole == "staff" ? (
                    <td className="p-2">
                      <div className="text-center text-green-500">
                        ₵{product.selling_price}
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="p-2">
                        <div className="text-center text-red-500">
                          ₵{product.cost_price}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-green-500">
                          ₵{product.selling_price}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-green-500">
                          ₵
                          {(product.selling_price - product.cost_price).toFixed(
                            2,
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
