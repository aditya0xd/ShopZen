import { useCartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCartContext();

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between bg-white p-4 rounded"
          >
            <div>
              <h2 className="font-semibold">{item.product.title}</h2>
              <p className="text-sm text-gray-500">₹{item.product.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xl font-bold">Total: ₹{totalPrice}</div>
    </div>
  );
}
