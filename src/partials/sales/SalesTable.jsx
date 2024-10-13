function AddSalesTable({ sales }) {
  return (
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
            <td className="p-4 mb-5">
              {sale.product}, {sale.product}
            </td>
            <td className="p-4 mb-5 text-green-600 dark:text-green-500">
              ${sale.price}
            </td>
            <td className="p-4">
              <button className="hover:text-red-600">{sale.time}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AddSalesTable;