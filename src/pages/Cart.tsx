import { useCartContext } from "../context/CartContext";
import ProgressiveImage from "../components/common/ProgressiveImage";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCartContext();

  if (cart.length === 0) {
    return (
      <div className="mt-20 text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Looks like you haven't added anything yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Your Cart
      </h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="
              flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4
              dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <ProgressiveImage
                  thumbnailSrc={item.product.thumbnail}
                  highResSrc={item.product.image || item.product.images?.[0]}
                  alt={item.product.title}
                  loading="lazy"
                  delayMs={500}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.product.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {"\u20B9"}
                  {item.product.price}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 text-lg hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-800"
                >
                  -
                </button>

                <span className="px-3 text-sm font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                  className="px-3 py-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-sm text-red-500 transition hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-t pt-6 dark:border-gray-700">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Total
        </span>
        <span className="text-xl font-bold text-indigo-600">
          {"$"}
          {totalPrice}
        </span>
      </div>
    </div>
  );
}
