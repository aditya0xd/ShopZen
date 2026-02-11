import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product";
import { useCartContext } from "../context/CartContext";
import ProductDetailsSkeleton from "../components/product/ProductDetailsSkeleton";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { cart, addToCart } = useCartContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    setProduct(null);

    const controller = new AbortController();
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/products/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Product not found");

        const data: Product = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Failed to load product");
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [id]);

  if (loading) return <ProductDetailsSkeleton />;

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  if (!product)
    return <p className="text-center mt-10 text-gray-500">No product found</p>;

  const isInCart = cart.some((item) => item.product.id === product.id);

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Image */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <img
          src={product.images![0] || product.thumbnail}
          alt={product.title}
          className="w-full h-80 object-cover rounded-md"
        />
      </div>

      {/* Details */}
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {product.title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          {product.description}
        </p>

        <div className="flex items-center gap-4">
          <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            ${product.price}
          </span>
          <span className="text-yellow-500">⭐ {product.rating}</span>
        </div>

        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {product.brand && <p>Brand: {product.brand}</p>}
          {product.category && <p>Category: {product.category}</p>}
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={isInCart}
          className={`
          mt-6
          px-6 py-3
          rounded-md
          font-medium
          transition
          cursor-pointer
          ${
            isInCart
              ? "bg-gray-400  text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }
        `}
        >
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
