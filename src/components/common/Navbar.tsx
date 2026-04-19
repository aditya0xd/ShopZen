import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCartContext } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { useDebounce } from "../../hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MobileNavbar from "./MobileNavbar";

import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

const Navbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { cart } = useCartContext();
  const { theme, toggleTheme } = useTheme();
  const { logedIn, logout, name } = useAuth();

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const debounced = useDebounce(search, 500);

  const isAuthPage =
    location.pathname === "/Login" ||
    location.pathname.toLowerCase() === "/signup";

  useEffect(() => {
    if (location.pathname === "/products") {
      const params = new URLSearchParams(location.search);
      const q = params.get("q") || "";
      setSearch(q);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const value = debounced.trim();
    const isProductListPage = location.pathname === "/products";

    // DO NOTHING if not on products list page
    if (!isProductListPage) return;

    // Empty search → remove query
    if (!value) {
      if (location.search) {
        navigate("/products", { replace: true });
      }
      return;
    }

    const url = `/products?q=${encodeURIComponent(value)}`;
    navigate(url, { replace: true });
  }, [debounced, location.pathname, location.search, navigate]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  const themeLabel = theme === "light" ? "Dark" : "Light";

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
          <div className="relative w-full max-w-xl sm:flex sm:items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              className="pl-9"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                // Don't navigate on focus when on Login/Signup - avoids stealing focus from form
                if (isAuthPage) return;
                if (location.pathname !== "/products") {
                  navigate("/products");
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                if (isAuthPage) {
                  const q = search.trim();
                  navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
                }
              }}
            />
          </div>

          <div className="hidden items-center gap-6 sm:flex">
            <Link
              to="/cart"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300"
            >
              Cart
              {totalItems > 0 && (
                <Badge variant="secondary">{totalItems}</Badge>
              )}
            </Link>

            {!logedIn && (
              <Link
                className="text-sm text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                to="/Login"
              >
                Login
              </Link>
            )}

            {logedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white uppercase">
                    {initial}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="truncate">
                    {name || "User"}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {themeLabel}
            </button>
          </div>

          <MobileNavbar
            open={open}
            setOpen={setOpen}
            totalItems={totalItems}
            logedIn={logedIn}
            logout={logout}
            name={name}
            initial={initial}
            toggleTheme={toggleTheme}
            themeLabel={themeLabel}
            mobileNavLinkClass={mobileNavLinkClass}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
