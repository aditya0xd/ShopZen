import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* ================= HERO ================= */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          Shop smarter with <span className="text-indigo-600">ShopZen</span>
        </h1>

        <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover quality products with fast search, smooth infinite scrolling,
          and a clutter-free shopping experience.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/products"
            className="px-7 py-3 rounded-md bg-indigo-600 text-white font-medium
              hover:bg-indigo-700 transition"
          >
            Browse Products
          </Link>

          <Link
            to="/cart"
            className="px-7 py-3 rounded-md border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            View Cart
          </Link>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
        {["Electronics", "Fashion", "Home", "Beauty"].map((cat) => (
          <Link
            key={cat}
            to="/products"
            className="p-6 text-center rounded-lg border dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
          >
            {cat}
          </Link>
        ))}
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="mt-24">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
          Trending Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-48 rounded-lg bg-gray-100 dark:bg-gray-800
                flex items-center justify-center text-gray-400"
            >
              Product Preview
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRUST SIGNALS ================= */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 text-center">
        <div>
          <p className="text-2xl font-bold text-indigo-600">10k+</p>
          <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-indigo-600">4.8★</p>
          <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-indigo-600">100%</p>
          <p className="text-gray-600 dark:text-gray-400">Secure Payments</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-indigo-600">Easy</p>
          <p className="text-gray-600 dark:text-gray-400">Returns & Support</p>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="grid gap-8 md:grid-cols-3 mt-24">
        <div className="p-6 rounded-lg border dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">⚡ Fast Experience</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Optimized APIs, debounced search, and smooth infinite scroll.
          </p>
        </div>

        <div className="p-6 rounded-lg border dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">🎯 Simple UI</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Clean layout focused on products, not distractions.
          </p>
        </div>

        <div className="p-6 rounded-lg border dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">🛡 Reliable</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Stable architecture built with modern React & TypeScript.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-32 py-10 border-t dark:border-gray-700 text-center">
        <p className="text-gray-500">
          © {new Date().getFullYear()} ShopZen. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
