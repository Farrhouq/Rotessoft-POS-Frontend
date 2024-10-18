import React, { useRef, useEffect, useState } from "react";
import Transition from "../utils/Transition";
import api from "../apiClient";
import toaster from "react-hot-toast";

function AddProductModal({ modalOpen, setModalOpen, products, setProducts }) {
  const modalContent = useRef(null);

  // State to store form data
  const [productName, setProductName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [amountInStock, setAmountInStock] = useState(1);

  // Handle form submission
  const addProduct = (e) => {
    e.preventDefault();

    // Payload to send in the POST request
    const productData = {
      name: productName,
      selling_price: sellingPrice,
      cost_price: costPrice,
      amount_in_stock: amountInStock,
    };

    // Make API call to add product
    api
      .post("product/", {
        ...productData,
        store: localStorage.getItem("shopId"),
      })
      .then((res) => {
        // console.log(res.data);
        // Close the modal after successful submission
        setModalOpen(false);
        // Update the products list
        setProducts([...products, res.data]);
        localStorage.setItem(
          "products",
          JSON.stringify([...products, res.data]),
        );
        toaster.success("Product added successfully!");
        setProductName("");
        setSellingPrice("");
        setCostPrice("");
        setAmountInStock(1);
      })
      .catch((err) => {
        console.error(err);
        // Handle error
      });
  };

  // close on ESC key press
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-24 mb-4 justify-center sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white w-screen dark:bg-gray-800 border border-transparent dark:border-gray-700/60 max-w-2xl max-h-full rounded-lg shadow-lg"
        >
          {/* form */}
          <form
            className="w-full border-gray-200 dark:border-gray-700/60 px-3 py-5"
            onSubmit={addProduct}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Add Product
            </h3>
            <hr className="my-4 text-gray-900" />
            <div className="grid gap-6 mb-6 pt-2 w-full">
              <div className="col-span-12 w-full">
                <label>Product Name</label>
                <input
                  type="text"
                  className="bg-gray-50 h-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter product name..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)} // Update state
                  required
                />
              </div>

              <div className="col-span-6">
                <label>Selling price</label>
                <input
                  type="number"
                  className="bg-gray-50 h-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter selling price..."
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)} // Update state
                  required
                />
              </div>
              <div className="col-span-6">
                <label>Cost price</label>
                <input
                  type="number"
                  className="bg-gray-50 h-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter cost price..."
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)} // Update state
                  required
                />
              </div>

              <div className="col-span-6">
                <label>Amount In Stock</label>
                <input
                  type="number"
                  className="bg-gray-50 h-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter stock amount..."
                  value={amountInStock}
                  onChange={(e) => setAmountInStock(e.target.value)} // Update state
                  required
                />
              </div>
              <div className="col-span-12 flex gap-2">
                <button
                  type="submit"
                  className="text-white w-fit bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-white dark:text-white w-fit bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center hover:bg-red-700 dark:focus:ring-blue-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </Transition>
    </>
  );
}

export default AddProductModal;
