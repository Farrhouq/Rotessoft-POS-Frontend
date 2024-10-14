import apiClient from "../apiClient";
import Inventory from "../partials/products/Inventory";
import { checkLogin } from "../utils/Utils";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const role = checkLogin();
    if (localStorage.getItem("products")) {
      setProducts(JSON.parse(localStorage.getItem("products")));
    } else {
      apiClient.get("product/").then((res) => {
        setProducts(res.data);
        localStorage.setItem("products", JSON.stringify(res.data));
      });
    }
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
