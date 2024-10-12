import api from "../apiClient";
import Inventory from "../partials/products/Inventory";
import { checkLogin } from "../utils/Utils";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const role = checkLogin();
    api.get("product/").then((res) => {
      setProducts(res.data);
    });
    checkLogin();
  }, []);
  return (
    <main className="grow">
      <div className="sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Inventory products={products} setProducts={setProducts} />
      </div>
    </main>
  );
};

export default Products;
