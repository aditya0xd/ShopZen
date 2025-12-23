import { Link, NavLink } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { cart } = useCartContext();
  const { theme, toggleTheme } = useTheme();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-indigo-600"
        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
          Shop<span className="text-indigo-600">Zen</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
          >
            Cart
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center
                bg-indigo-600 text-white text-xs rounded-full px-1"
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-2 w-9 h-9 flex items-center justify-center rounded-md
              border border-gray-300 dark:border-gray-700
              hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
