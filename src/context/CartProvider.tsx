import { CartContext } from "./CartContext";
import { useCart } from "../hooks/useCart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cartLogic = useCart();

  return (
    <CartContext.Provider value={cartLogic}>{children}</CartContext.Provider>
  );
};
