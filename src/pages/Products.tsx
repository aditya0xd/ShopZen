import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/product/ProductSkeleton";
import type { Product } from "../types/product";
import { useDebounce } from "../hooks/useDebounce";

const LIMIT = 20;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  // Fetch function (outside useEffect)

  const fetchProducts = useCallback(
    async (currentPage: number, searchTerm: string) => {
      if (loadingRef.current) return; //  hard guard
      loadingRef.current = true;
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(currentPage + 1), // backend is 1-based
          limit: String(LIMIT),
        });

        if (searchTerm) {
          params.set("q", searchTerm);
        }
        const API_URL =
          import.meta.env.VITE_API_URL ||
          "https://shopzen-backend-production.up.railway.app";

        const url = `${API_URL}/api/v1/products?${params.toString()}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();

        setProducts((prev) => {
          const newProducts =
            currentPage === 0 ? data.products : [...prev, ...data.products];

          return newProducts;
        });

        setHasMore(data.products.length === LIMIT);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        loadingRef.current = false; // release lock
        setLoading(false);
      }
    },
    [],
  );

  // Reset and fetch when search changes
  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    fetchProducts(0, debouncedSearch);
  }, [debouncedSearch, fetchProducts]);

  useEffect(() => {
    if (page > 0) {
      fetchProducts(page, debouncedSearch);
    }
  }, [page, debouncedSearch, fetchProducts]);

  // Fetch more when page increments (skip initial mount)

  // IntersectionObserver setup
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded border px-4 py-2 
          bg-white text-gray-900
          dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      />

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={`product-${product.id}`} product={product} />
        ))}
      </div>

      {loading && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {products.length === 0 && !loading && !error && (
        <p className="text-center text-gray-400 mt-6">
          No match for "{debouncedSearch}"
        </p>
      )}

      {/* Sentinel */}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default Products;
