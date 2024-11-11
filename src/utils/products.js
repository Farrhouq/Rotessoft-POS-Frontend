export const updateStock = (name, newAmount) => {
  // Update the products state
  let prevProducts = JSON.parse(localStorage.getItem("products")) || [];
  let newProducts = prevProducts.map((product) =>
    product.name === name
      ? { ...product, amount_in_stock: newAmount }
      : product,
  );
  localStorage.setItem("products", JSON.stringify(newProducts));
};
