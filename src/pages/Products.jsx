import Inventory from "../partials/products/Inventory";
import { checkLogin } from "../utils/Utils";

const Products = () => {
  checkLogin();
  return (
    <main className="grow">
      <div className="sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Inventory />
      </div>
    </main>
  );
};

export default Products;
