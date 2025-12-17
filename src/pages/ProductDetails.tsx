import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product";
import { useCart } from "../hooks/useCart";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    setProduct(null);

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`, {
          signal,
        });

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data: Product = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err: any) {
        if (err.name === "AbortError") {
          return;
        }
        setError("Failed to load product");
        setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!product) {
    return <p>No product found</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image */}
      <div className="bg-white p-4 rounded-lg">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-80 object-cover rounded"
        />
      </div>

      {/* Details */}
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>

        <p className="text-gray-500 mt-2">{product.description}</p>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-xl font-semibold">₹{product.price}</span>
          <span className="text-yellow-500">⭐ {product.rating}</span>
        </div>

        <div className="mt-6 space-y-1 text-sm text-gray-600">
          {product.brand && <p>Brand: {product.brand}</p>}
          {product.category && <p>Category: {product.category}</p>}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
