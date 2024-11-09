import { checkLogin } from "../../utils/Utils";
import SaleDetailModal from "../../components/SaleDetailModal";
import { useState } from "react";

function SalesTable({ sales }) {
  const [saleDetailModalOpen, setSaleDetailModalOpen] = useState(false);
  const [saleId, setSaleId] = useState(null);
  const userRole = checkLogin();
  const getSaleDetail = (index) => {
    const saleUrl =
      userRole === "staff" ? "product/" : `product/?store=${shopId}`;
  };

  return (
    <>
      <table
        style={{ padding: "40px" }}
        className="w-full text-left table-auto bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
      >
        <thead className="dark:bg-gray-700 bg-gray-200">
          <tr>
            <th className="p-3">Products</th>
            <th className="p-3">Total Price</th>
            <th className="p-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 dark:border-gray-800 mb-5 p-5"
            >
              <td
                className="p-4 mb-5 hover:text-violet-600 cursor-pointer"
                // onClick={() => getSaleDetail(index)}
                onClick={() => {
                  setSaleDetailModalOpen(true);
                  setSaleId(sale.id);
                }}
              >
                {sale.product_string}
              </td>
              <td className="p-4 mb-5 text-green-600 dark:text-green-500">
                ₵ {sale.total}
              </td>
              <td className="p-4">
                <button className="hover:text-red-600 lowercase">
                  {new Date(sale.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SaleDetailModal
        saleId={saleId}
        modalOpen={saleDetailModalOpen}
        setModalOpen={setSaleDetailModalOpen}
      />
    </>
  );
}

export default SalesTable;
