import { useCartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCartContext();

  /* ---------- Empty State ---------- */
  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Looks like you haven’t added anything yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Your Cart
      </h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="
              flex flex-col sm:flex-row
              sm:items-center sm:justify-between
              gap-4
              rounded-lg
              border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900
              p-4
            "
          >
            {/* Product Info */}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {item.product.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ₹{item.product.price}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="
                    px-3 py-1
                    text-lg
                    disabled:opacity-40
                    hover:bg-gray-100 dark:hover:bg-gray-800
                  "
                >
                  −
                </button>

                <span className="px-3 text-sm font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                  className="
                    px-3 py-1
                    text-lg
                    hover:bg-gray-100 dark:hover:bg-gray-800
                  "
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-sm text-red-500 hover:text-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 flex items-center justify-between border-t dark:border-gray-700 pt-6">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Total
        </span>
        <span className="text-xl font-bold text-indigo-600">₹{totalPrice}</span>
      </div>
    </div>
  );
}
