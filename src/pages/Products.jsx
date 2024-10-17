import apiClient from "../apiClient";
import Inventory from "../partials/products/Inventory";
import { checkLogin } from "../utils/Utils";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const userRole = checkLogin();
  const shopId = localStorage.getItem("shopId");

  useEffect(() => {
    if (localStorage.getItem("products")) {
      setProducts(JSON.parse(localStorage.getItem("products")));
    } else {
      if (userRole == "staff") {
        apiClient.get("product/").then((res) => {
          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
        });
      } else {
        apiClient.get(`product/?store=${shopId}`).then((res) => {
          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
        });
      }
    }
  }, []);
  return (
    <main className="grow">
      <div className="sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Inventory
          userRole={userRole}
          products={products}
          setProducts={setProducts}
        />
      </div>
    </main>
  );
};

export default Products;
