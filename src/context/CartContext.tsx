import { createContext, useContext } from "react";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => Promise<boolean>;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, qty: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
};
