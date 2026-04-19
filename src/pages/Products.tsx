import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/product/ProductSkeleton";
import type { Product } from "../types/product";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const LIMIT = 20;

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchFromURL = searchParams.get("q") || "";

  const debouncedSearch = useDebounce(searchFromURL, 500);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  const fetchProducts = useCallback(
    async (
      currentPage: number,
      searchTerm: string,
      selectedCategory: string,
    ) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(currentPage + 1),
          limit: String(LIMIT),
        });

        if (searchTerm) params.set("q", searchTerm);
        if (selectedCategory) params.set("category", selectedCategory);

        const API_URL =
          import.meta.env.VITE_API_URL ||
          "https://shopzen-backend.onrender.com";

        const url = `${API_URL}/api/v1/products?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();

        setProducts((prev) =>
          currentPage === 0 ? data.products : [...prev, ...data.products],
        );

        setHasMore(data.pagination.hasNext);
      } catch {
        setError("Something went wrong");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    fetchProducts(0, debouncedSearch, category);
  }, [debouncedSearch, category, fetchProducts]);

  useEffect(() => {
    if (page === 0) return;
    fetchProducts(page, debouncedSearch, category);
  }, [page, debouncedSearch, category, fetchProducts]);

  useEffect(() => {
    const sentinel = loaderRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasMore && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "100px", // Start loading before user reaches bottom
        threshold: 0.01, // Fire when at least 1% visible (avoids edge flicker)
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Filters</h2>

            {category && (
              <Badge variant="secondary" className="capitalize">
                {category}
              </Badge>
            )}
          </div>

          <Separator />

          <Select
            value={category || "all"}
            onValueChange={(value) => {
              const selected = value === "all" ? "" : value;
              setCategory(selected);
            }}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="smartphones">Electronics</SelectItem>
              <SelectItem value="mens-shirts">Fashion</SelectItem>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="sports-accessories">Sports</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Products Grid - products + inline skeletons during append to prevent jitter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={`product-${product.id}`} product={product} />
        ))}
        {/* Append load: 4 skeletons inline (1 row) - avoids layout jump vs 8 below */}
        {loading &&
          page > 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={`skeleton-append-${i}`} />
          ))}
      </div>

      {/* Initial load: full skeleton grid (page 0) - separate to avoid grid mismatch */}
      {loading && page === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={`skeleton-initial-${i}`} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && !loading && !error && (
        <Card>
          <CardContent className="p-10 text-center space-y-2">
            <p className="text-muted-foreground">
              No match for "{debouncedSearch}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default Products;
