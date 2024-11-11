import React, { useRef, useEffect, useState } from "react";
import Transition from "../utils/Transition";
import api from "../apiClient";
import { checkLogin } from "../utils/Utils";
import { ArrowDownIcon } from "lucide-react";
import toaster from "react-hot-toast";

function SaleDetailModal({ saleId, modalOpen, setModalOpen }) {
  const [saleDetails, setSaleDetails] = useState({
    made_by: null,
    customer_name: null,
    created_at: null,
    products: [],
    total: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    let shopId = localStorage.getItem("shopId");
    if (modalOpen) {
      const userRole = checkLogin();
      let saleUrl =
        userRole == "staff"
          ? `sale/${saleId}`
          : `sale/${saleId}?store=${shopId}`;
      setLoading(true);
      let saleDetails = JSON.parse(localStorage.getItem("saleDetails")) || {};
      if (saleDetails[saleId]) {
        setSaleDetails(saleDetails[saleId]);
        setLoading(false);
        return;
      }
      api
        .get(saleUrl)
        .then((res) => {
          setSaleDetails(res.data);
          setLoading(false);
          saleDetails[saleId] = res.data;
          localStorage.setItem("saleDetails", JSON.stringify(saleDetails));
        })
        .catch(() => {
          toaster.error("Sale not found!");
          setLoading(false);
          setModalOpen(false);
        });
    }
  }, [modalOpen, saleId]);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-24 mb-4 justify-center sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div className="relative w-full max-w-2xl max-h-full">
          <div className="border-l-8 border-violet-500 p-4 relative bg-white rounded-xl shadow dark:bg-gray-700">
            <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t dark:border-gray-600">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Sale Detail
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="p-4 space-y-4 w-full h-full flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-10 w-10 text-violet-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              <div className="p-2 sm:p-4 space-y-4">
                {/* details */}
                <div className="flex justify-between flex-col sm:w-[50%] mb-5">
                  <div className="flex justify-between">
                    <p className="text-sm  font-bold text-gray-500 dark:text-gray-400">
                      Sold By:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {saleDetails.made_by}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm  font-bold text-gray-500 dark:text-gray-400">
                      Customer Name:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {saleDetails.customer_name}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm  font-bold text-gray-500 dark:text-gray-400">
                      Total Price:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {saleDetails.total}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm  font-bold text-gray-500 dark:text-gray-400">
                      Date and Time:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(saleDetails.created_at).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>

                {/* table */}
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                  <table
                    style={{ padding: "40px" }}
                    className="w-full text-left table-auto bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  >
                    <thead className="dark:bg-gray-700 bg-gray-200">
                      <tr>
                        <th className="p-3 uppercase text-sm">Product</th>
                        <th className="p-3 uppercase text-sm">Quantity</th>
                        <th className="p-3 uppercase text-sm">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleDetails.products.map((product) => (
                        <tr
                          key={product.product__name}
                          className="border-b border-gray-200 dark:border-gray-800 mb-5 p-5"
                        >
                          <td className="p-4 mb-5 hover:text-violet-600 cursor-pointer">
                            {product.product__name}
                          </td>
                          <td className="p-4 justify mb-5 text-green-600 gap-3 dark:text-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                {product.previous_quantity}
                              </span>
                              {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="w-4 h-4 fill-red-500 dark:text-red-500"
                              >
                                <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                              </svg> */}
                              <ArrowDownIcon className="w-4 text-red-500 h-4 fill-red-500 dark:text-red-500" />
                              <span className="text-red-500">
                                {product.quantity}
                              </span>
                              {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="w-4 h-4 fill-red-500 dark:text-red-500"
                              >
                                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                              </svg> */}
                              =
                              <span className="text-green-700">
                                {product.previous_quantity - product.quantity}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <button className="hover:text-red-600 lowercase">
                              {product.product__selling_price}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </>
  );
}

export default SaleDetailModal;
