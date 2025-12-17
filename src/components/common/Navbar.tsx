import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = "text-sm font-medium text-gray-700 hover:text-black";

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          QuickCart
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "font-semibold text-black" : linkClass
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "font-semibold text-black" : linkClass
            }
          >
            Cart
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
