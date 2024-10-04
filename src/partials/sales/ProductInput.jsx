import { useState } from "react";

function ProductInput({ onAdd }) {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (product && quantity > 0) {
      onAdd({ product, quantity });
      setProduct("");
      setQuantity(1);
    }
  };

  return (
    <div className="flex space-x-4 mb-4">
      <select
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        className="w-full p-2 border border-gray-700 rounded-lg text-white bg-gray-800"
      >
        <option value="">Select Product</option>
        <option value="Product 1">Product 1</option>
        <option value="Product 2">Product 2</option>
      </select>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
        className="w-20 p-2 border border-gray-700 rounded-lg text-white bg-gray-800"
      />
      <button
        onClick={handleAdd}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add
      </button>
    </div>
  );
}

export default ProductInput;
