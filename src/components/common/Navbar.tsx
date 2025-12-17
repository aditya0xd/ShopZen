import { Link, NavLink } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";

const Navbar = () => {
  const { cart } = useCartContext();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          QuickCart
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/products">Products</NavLink>

          <Link to="/cart" className="relative">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
