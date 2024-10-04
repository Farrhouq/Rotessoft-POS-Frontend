function AddSalesTable({ sales, onRemove }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale, index) => (
          <tr key={index}>
            <td>{sale.product}</td>
            <td>{sale.quantity}</td>
            <td>{sale.price}</td>
            <td>
              <button onClick={() => onRemove(index)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AddSalesTable;
