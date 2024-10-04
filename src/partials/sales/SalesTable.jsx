function AddSalesTable({ sales }) {
  return (
    <table className="w-full text-left table-auto bg-gray-900 text-gray-200">
      <thead className="bg-gray-700">
        <tr>
          <th className="p-2">Products</th>
          <th className="p-2">Total Price</th>
          <th className="p-2">Time</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale, index) => (
          <tr key={index} className="border-b border-gray-800">
            <td className="p-2">
              {sale.product}, {sale.product}
            </td>
            <td className="p-2 text-green-200">${sale.price}</td>
            <td className="p-2">
              <button className="hover:text-red-600">{sale.time}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AddSalesTable;
