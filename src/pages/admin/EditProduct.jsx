import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import Select from "react-select";
import apiClient from "../../apiClient";
import { checkLogin } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";
import toaster from "react-hot-toast";

const EditProductForm = () => {
  // const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const shopId = localStorage.getItem("shopId");
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    label: "",
  });
  const navigate = useNavigate();

  // permissions
  useEffect(() => {
    const userRole = checkLogin();
    if (userRole != "admin") navigate("/");
    if (!shopId) navigate("/admin/");
  });

  useEffect(() => {
    if (localStorage.getItem("products")) {
      setProducts(JSON.parse(localStorage.getItem("products")));
    } else {
      apiClient.get(`product/?store=${shopId}`).then((res) => {
        setProducts(res.data);
        localStorage.setItem("products", JSON.stringify(res.data));
      });
    }
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.id === selectedProduct.id);
      if (product) {
        setProductName(product.name);
        setCostPrice(product.cost_price.toString());
        setSellingPrice(product.selling_price.toString());
        setStock(product.amount_in_stock.toString());
      }
    }
  }, [selectedProduct]);

  const updateProduct = (id, { productName, sellingPrice, costPrice }) => {
    // Update the products state
    localStorage.setItem(
      "products",
      JSON.stringify(
        products.map((product) =>
          product.id === id
            ? {
                ...product,
                name: productName,
                selling_price: sellingPrice,
                cost_price: costPrice,
              }
            : product,
        ),
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiClient
      .patch(`product/${selectedProduct.id}/?store=${shopId}`, {
        name: productName,
        cost_price: costPrice,
        selling_price: sellingPrice,
        amount_in_stock: stock,
      })
      .then((res) => {
        toaster.success("Product updated successfully!");
        navigate("/products/");
        updateProduct(selectedProduct.id, {
          productName,
          costPrice,
          sellingPrice,
        });
      });
    // Here you would typically send the data to your backend
  };

  const handleInputChange = (e) => {
    const { value, label } = e;
    setSelectedProduct({ id: value, label });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    let confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (confirmDelete) {
      apiClient
        .delete(`product/${selectedProduct.id}/?store=${shopId}`)
        .then((res) => {
          toaster.success("Product deleted successfully!");
          products.splice(
            products.findIndex((p) => p.id === selectedProduct.id),
            1,
          );
          localStorage.setItem("products", JSON.stringify(products));
          navigate("/products/");
        });
    }
  };

  return (
    <div className="flex-1 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Edit Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-12 gap-4 w-full sm:w-[70%]">
          <div className="col-span-12">
            <label
              htmlFor="product-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Select Product
            </label>
            <div className="relative">
              {/* <select
                id="product-select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select> */}
              <Select
                className="dark:bg-gray-800"
                options={products.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                onChange={(e) => handleInputChange(e)}
                styles={{
                  input: (base) => ({
                    ...base,
                    "input:focus": {
                      boxShadow: "none",
                    },
                  }),
                  option: (base) => ({
                    ...base,
                    color: "black",
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-span-12">
            <label
              htmlFor="product-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="col-span-6">
            <label
              htmlFor="cost-price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Cost Price
            </label>
            <input
              type="number"
              id="cost-price"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="col-span-6">
            <label
              htmlFor="selling-price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Selling Price
            </label>
            <input
              type="number"
              id="selling-price"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="col-span-12">
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Current Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              readOnly
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="w-fit flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-purple-700 dark:hover:bg-purple-800"
          >
            Update Product
          </button>
          {selectedProduct.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-fit flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
