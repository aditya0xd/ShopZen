import { Link, NavLink } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { cart } = useCartContext();

  const { theme, toggleTheme } = useTheme();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white text-gray-900">
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
          <button
            onClick={toggleTheme}
            className="ml-4 px-3 py-1 rounded border text-sm dark:border-gray-600"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
