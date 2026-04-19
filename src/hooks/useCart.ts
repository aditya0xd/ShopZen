import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";
import { getCartFromStorage, saveCartToStorage } from "../utils/storage";
import { getAccessToken } from "@/lib/auth";
import { useAuth } from "./useAuth";

const API_URL =
  import.meta.env.VITE_API_URL || "https://shopzen-backend.onrender.com";

type CartApiItem = {
  productId?: string | number;
  quantity?: number;
  product?: Partial<Product>;
};

type CartApiResponse = {
  items?: CartApiItem[];
  totalPrice?: number;
};

const normalizeCartItem = (item: CartApiItem): CartItem => {
  const product = item.product ?? {};
  const fallbackImage = product.image || product.images?.[0] || "";

  return {
    quantity: Number(item.quantity ?? 1),
    product: {
      id: product.id ?? item.productId ?? "",
      title: product.title ?? "Product",
      description: product.description ?? "",
      price: Number(product.price ?? 0),
      image: product.image,
      thumbnail: product.thumbnail ?? fallbackImage,
      rating: Number(product.rating ?? 0),
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      availabilityStatus: product.availabilityStatus,
      brand: product.brand,
      category: product.category,
      images: Array.isArray(product.images) ? product.images : undefined,
    },
  };
};

export const useCart = () => {
  const { logedIn } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => getCartFromStorage());
  const [serverTotalPrice, setServerTotalPrice] = useState<number | null>(null);

  // helper that aborts a fetch if it doesn't complete within `ms` milliseconds
  const fetchWithTimeout = async (
    input: RequestInfo,
    init: RequestInit = {},
    ms = 10000,
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(input, { ...init, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(timeout);
    }
  };

  const hydrateCart = useCallback(async () => {
    const token = getAccessToken();
    if (!logedIn || !token) {
      setServerTotalPrice(null);
      setCart(getCartFromStorage());
      return;
    }

    try {
      const res = await fetchWithTimeout(`${API_URL}/api/v1/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        setCart([]);
        setServerTotalPrice(0);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to hydrate cart");
      }

      const data: CartApiResponse = await res.json();
      const nextCart = Array.isArray(data.items)
        ? data.items.map(normalizeCartItem)
        : [];

      setCart(nextCart);
      setServerTotalPrice(
        typeof data.totalPrice === "number" ? data.totalPrice : null,
      );
    } catch {
      setCart([]);
      setServerTotalPrice(0);
    }
  }, [logedIn]);

  useEffect(() => {
    void hydrateCart();
  }, [hydrateCart]);

  const addToCart = async (product: Product): Promise<boolean> => {
    const token = getAccessToken();
    if (logedIn && token) {
      try {
        const res = await fetchWithTimeout(`${API_URL}/api/v1/cart/items`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: String(product.id),
            quantity: 1,
          }),
        });

        if (!res.ok) {
          return false;
        }

        await hydrateCart();
      } catch {
        // no-op; if the request timed out/failed the button will be re-enabled
        return false;
      }
      return true;
    }

    setServerTotalPrice(null);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const nextCart = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...prev, { product, quantity: 1 }];

      saveCartToStorage(nextCart);
      return nextCart;
    });
    return true;
  };

  const removeFromCart = async (id: string | number) => {
    const token = getAccessToken();
    if (logedIn && token) {
      try {
        const res = await fetch(`${API_URL}/api/v1/cart/items`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: String(id),
          }),
        });

        if (!res.ok) {
          return;
        }

        await hydrateCart();
      } catch {
        // no-op
      }
      return;
    }

    setServerTotalPrice(null);
    setCart((prev) => {
      const nextCart = prev.filter((item) => item.product.id !== id);
      saveCartToStorage(nextCart);
      return nextCart;
    });
  };

  const updateQuantity = async (id: string | number, qty: number) => {
    if (qty < 1) return;

    const token = getAccessToken();
    if (logedIn && token) {
      try {
        const res = await fetch(`${API_URL}/api/v1/cart/items`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: String(id),
            quantity: qty,
          }),
        });

        if (!res.ok) {
          return;
        }

        await hydrateCart();
      } catch {
        // no-op
      }
      return;
    }

    setServerTotalPrice(null);
    setCart((prev) => {
      const nextCart = prev.map((item) =>
        item.product.id === id ? { ...item, quantity: qty } : item,
      );
      saveCartToStorage(nextCart);
      return nextCart;
    });
  };

  const clearCart = async () => {
    const token = getAccessToken();
    if (logedIn && token) {
      try {
        const res = await fetch(`${API_URL}/api/v1/cart`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok && res.status !== 404) {
          return;
        }

        setCart([]);
        setServerTotalPrice(0);
      } catch {
        // no-op
      }
      return;
    }

    setServerTotalPrice(null);
    setCart([]);
    saveCartToStorage([]);
  };

  const localTotalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const totalPrice =
    logedIn && serverTotalPrice !== null ? serverTotalPrice : localTotalPrice;

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
  };
};
