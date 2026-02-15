import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useCartContext } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { cart } = useCartContext();
  const { theme, toggleTheme } = useTheme();
  const { logedIn, logout, name } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  const themeLabel = theme === "light" ? "Dark" : "Light";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-indigo-600"
        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600"
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-2 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          >
            Shop<span className="text-indigo-600">Zen</span>
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>

            <Link
              to="/cart"
              className="relative text-sm font-medium text-gray-600 transition hover:text-indigo-600 dark:text-gray-300"
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {!logedIn && (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <Link to="/Login">Login</Link>/<Link to="/Signup">Signup</Link>
              </span>
            )}

            {logedIn && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white uppercase"
                >
                  {initial}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="truncate px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {name || "User"}
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700" />
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {themeLabel}
            </button>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {themeLabel}
            </button>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-md p-2 text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 sm:hidden">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/products"
                className={mobileNavLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                Products
              </NavLink>

              <Link
                to="/cart"
                className="flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              {logedIn ? (
                <>
                  <p className="truncate px-2 pt-2 text-xs text-gray-500 dark:text-gray-400">
                    {name || "User"}
                  </p>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="rounded-md px-2 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-2 py-2 text-sm text-gray-700 dark:text-gray-300">
                  <Link to="/Login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <span> / </span>
                  <Link to="/Signup" onClick={() => setMenuOpen(false)}>
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

