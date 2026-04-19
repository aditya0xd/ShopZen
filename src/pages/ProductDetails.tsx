import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product";
import { useCartContext } from "../context/CartContext";
import ProductDetailsSkeleton from "../components/product/ProductDetailsSkeleton";
import ProgressiveImage from "../components/common/ProgressiveImage";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { cart, addToCart } = useCartContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // state for add-to-cart button activity must be declared before any conditional return
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    setProduct(null);

    const controller = new AbortController();
    const API_URL =
      import.meta.env.VITE_API_URL ||
      "https://shopzen-backend.onrender.com";

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
    return (
      <p className="text-center mt-10 text-muted-foreground">
        No product found
      </p>
    );

  const isInCart = cart.some((item) => item.product.id === product.id);

  const handleAdd = async () => {
    if (isInCart || adding) return;
    setAdding(true);
    const ok = await addToCart(product);
    setAdding(false);

    if (!ok) {
      toast.error("Unable to add item. Please try again.");
    } else {
      toast.success("Added to cart");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Image */}
      <Card>
        <CardContent className="p-4">
          <ProgressiveImage
            thumbnailSrc={product.thumbnail}
            highResSrc={product.image || product.images?.[0]}
            alt={product.title}
            loading="eager"
            delayMs={800}
            className="w-full h-80 object-cover rounded-md"
          />
        </CardContent>
      </Card>

      {/* Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-muted-foreground mt-2">{product.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
          <Badge variant="secondary">⭐ {product.rating}</Badge>
        </div>

        <Separator />

        <div className="space-y-2 text-sm text-muted-foreground">
          {product.brand && <p>Brand: {product.brand}</p>}
          {product.category && <p>Category: {product.category}</p>}
        </div>

        <Button
          onClick={handleAdd}
          disabled={isInCart || adding}
          className="w-fit"
        >
          {adding ? "Adding..." : isInCart ? "Added to Cart" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
