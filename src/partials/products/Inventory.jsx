import React from "react";
import { Link } from "react-router-dom";
import AddProductModal from "../../components/AddProductModal";
import RestockModal from "../../components/RestockModal";
import { useState } from "react";

function Inventory({ userRole, products, setProducts }) {
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex justify-between flex-col gap-2 md:flex-row">
          <h1 className="text-3xl font-bold">Products</h1>
          {/* button group */}
          {userRole == "admin" && (
            <div className="flex gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setRestockModalOpen(!restockModalOpen);
                }}
              >
                <button className="btn h-fit bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 dark:text-gray-800 dark:hover:bg-green-600">
                  <span className="">Restock</span>
                </button>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setAddProductModalOpen(!addProductModalOpen);
                }}
              >
                <button className="btn h-fit bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                  <span className="">Add Product</span>
                </button>
              </div>
              <AddProductModal
                id="search-modal"
                searchId="search"
                modalOpen={addProductModalOpen}
                setModalOpen={setAddProductModalOpen}
                products={products}
                setProducts={setProducts}
              />
              <RestockModal
                id="search-modal"
                searchId="search"
                modalOpen={restockModalOpen}
                setModalOpen={setRestockModalOpen}
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
                        <div className="text-center text-green-500">
                          ₵{product.selling_price}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-green-500">
                          ₵{product.cost_price}
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
