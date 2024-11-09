import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";
import Select from "react-select";
import api from "../apiClient";
import toaster from "react-hot-toast";

function RestockModal({ modalOpen, setModalOpen, products, setProducts }) {
  const modalContent = useRef(null);
  // const [productId, setProductId] = useState();
  const [restockQty, setRestockQty] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    label: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { value, label } = e;
    // setProductId(value);
    setSelectedProduct({ id: value, label });
  };

  const updateStock = (id, newAmount) => {
    // Update the products state
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, amount_in_stock: newAmount }
          : product,
      ),
    );
  };

  const submitForm = (e) => {
    e.preventDefault();
    const product = products.find(
      (product) => product.id === selectedProduct.id,
    );
    if (!product) {
      toaster.error("Please select a product.");
      return;
    }
    if (!restockQty) {
      toaster.error("Please enter a quantity.");
      return;
    }
    setLoading(true);
    api
      .patch(
        `/product/${selectedProduct.id}/?store=${localStorage.getItem("shopId")}`,
        {
          amount_in_stock: product.amount_in_stock + +restockQty,
        },
      )
      .then((res) => {
        setLoading(false);
        updateStock(selectedProduct.id, product.amount_in_stock + +restockQty);
        toaster.success("Product restocked!");
        setModalOpen(false);
        setRestockQty("");
        setSelectedProduct({ id: null, label: "" });
        e.target.reset();
      })
      .catch(() => {
        setLoading(false);
        toaster.error("You are offline.");
      });
  };

  // close if the esc key is pressed
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
          className="bg-white w-screen dark:bg-gray-800 border border-transparent dark:border-gray-700/60  max-w-2xl max-h-full rounded-lg shadow-lg"
        >
          {/* form */}
          <form
            className="w-full border-gray-200 dark:border-gray-700/60 px-3 py-5"
            onSubmit={submitForm}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Restock Product
            </h3>
            <hr className="my-4 text-gray-900" />
            <div className="grid gap-6 mb-6 md:grid-cols-2 pt-2 w-full">
              <div>
                <label>Select Product</label>
                <Select
                  value={selectedProduct.id ? selectedProduct : null}
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
              <div>
                <label>Add Quantity</label>
                <input
                  value={restockQty}
                  min={1}
                  type="number"
                  id="restock"
                  className="bg-gray-50 h-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter quantity to restock"
                  onChange={(e) => setRestockQty(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="text-white w-fit bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {loading ? "Submitting..." : "Restock"}
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

export default RestockModal;
