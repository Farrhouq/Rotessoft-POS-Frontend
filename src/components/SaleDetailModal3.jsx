import React from "react";
import { ArrowRight } from "lucide-react";

function SaleDetailModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-75">
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="border-l-8 border-violet-500 p-4 relative bg-white rounded-xl shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t dark:border-gray-600">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sale Detail
            </h3>
            <button
              type="button"
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
          <div className="p-4 space-y-4">
            {/* details */}
            <div className="flex justify-between flex-col w-[50%] mb-5">
              <div className="flex justify-between">
                <p className="text-sm  font-bold text-gray-500 dark:text-gray-400">
                  Sold By:
                </p>
                <p className="text-sm text-gray-900 dark:text-white">sals</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm  font-bold text-gray-500 dark:text-gray-400">
                  Customer Name:
                </p>
                <p className="text-sm text-gray-900 dark:text-white">fsdf</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm  font-bold text-gray-500 dark:text-gray-400">
                  Total Price:
                </p>
                <p className="text-sm text-gray-900 dark:text-white">2000</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm  font-bold text-gray-500 dark:text-gray-400">
                  Date and Time:
                </p>
                <p className="text-sm text-gray-900 dark:text-white">sdfs</p>
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
                  <tr className="border-b border-gray-200 dark:border-gray-800 mb-5 p-5">
                    <td className="p-4 mb-5 hover:text-violet-600 cursor-pointer">
                      Milo
                    </td>
                    <td className="p-4 justify mb-5 text-green-600 gap-3 dark:text-green-500">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">180</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="w-4 h-4 fill-red-500 dark:text-red-500"
                        >
                          <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                        </svg>
                        <span className="text-green-700">180</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button className="hover:text-red-600 lowercase">
                        29999
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleDetailModal;
