import apiClient from "../apiClient";
import Inventory from "../partials/products/Inventory";
import { processQueue } from "../utils/requestQueue";
import { checkLogin } from "../utils/Utils";
import { useEffect, useState } from "react";
import toaster from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const userRole = checkLogin();
  const shopId = localStorage.getItem("shopId");
  const [loading, setLoading] = useState(false);

  const refreshProducts = () => {
    setLoading(true);
    if (userRole == "admin")
      apiClient
        .get(`product/?store=${localStorage.getItem("shopId")}`)
        .then((res) => {
          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
          setLoading(false);
        })
        .catch((err) => {
          if (err.code == "ERR_NETWORK") toaster.error("You are offline!");
          setLoading(false);
        });
    else
      apiClient
        .get(`product/`)
        .then((res) => {
          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
          setLoading(false);
        })
        .catch((err) => {
          if (err.code == "ERR_NETWORK") toaster.error("You are offline!");
          setLoading(false);
        });
  };

  useEffect(() => {
    if (localStorage.getItem("products")) {
      setProducts(JSON.parse(localStorage.getItem("products")));
      refreshProducts();
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
          refreshProducts={refreshProducts}
          loading={loading}
        />
      </div>
    </main>
  );
};

export default Products;
