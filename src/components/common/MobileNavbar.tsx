import { Link, NavLink } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  totalItems: number;
  logedIn: boolean;
  logout: () => void;
  name?: string;
  initial: string;
  toggleTheme: () => void;
  themeLabel: string;
  mobileNavLinkClass: (args: { isActive: boolean }) => string;
};

const MobileNavbar = ({
  open,
  setOpen,
  totalItems,
  logedIn,
  logout,
  name,
  initial,
  toggleTheme,
  themeLabel,
  mobileNavLinkClass,
}: Props) => {
  return (
    <div className="flex items-center gap-2 sm:hidden">
      {/* Theme */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {themeLabel}
      </button>

      <div className="flex items-center gap-2 sm:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="rounded-md p-2 text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="p-5 w-72 sm:w-80">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-4">
              {/* Navigation */}
              <div className="flex flex-col gap-1">
                <NavLink
                  to="/products"
                  className={mobileNavLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Products
                </NavLink>

                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <Badge variant="secondary">{totalItems}</Badge>
                  )}
                </Link>
              </div>

              <div className="border-t" />

              {/* Auth */}
              {logedIn ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white uppercase">
                      {initial}
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/Login"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Login
                  </Link>

                  <Link
                    to="/Signup"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Signup
                  </Link>
                </div>
              )}

              <div className="border-t" />

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="rounded-md border px-3 py-2 text-sm font-medium"
              >
                {themeLabel}
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavbar;
