import { useCartContext } from "../context/CartContext";
import ProgressiveImage from "../components/common/ProgressiveImage";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCartContext();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const FREE_DELIVERY_THRESHOLD = 499;
  const DEFAULT_DELIVERY_FEE = 40;
  const deliveryFree = totalPrice > FREE_DELIVERY_THRESHOLD;
  const DELIVERY_FEE = deliveryFree ? 0 : DEFAULT_DELIVERY_FEE;
  const PLATFORM_FEE = 10;

  const subTotal = totalPrice + DELIVERY_FEE + PLATFORM_FEE;

  const COUPONS: Record<string, { percent: number; label: string }> = {
    save10: { percent: 10, label: "10% off" },
    save5: { percent: 5, label: "5% off" },
    extra10: { percent: 10, label: "10% off" },
    welcome5: { percent: 5, label: "5% off" },
  };

  const applyCoupon = () => {
    const code = coupon.trim().toLowerCase();
    const couponConfig = COUPONS[code];

    if (couponConfig) {
      const disc = subTotal * (couponConfig.percent / 100);
      setDiscount(disc);
      setAppliedCoupon(code);
      toast.success(`Coupon applied — ${couponConfig.label}`);
    } else {
      setDiscount(0);
      setAppliedCoupon(null);
      toast.error("Invalid coupon — Try SAVE10, SAVE5, EXTRA10, or WELCOME5");
    }
  };

  const grandTotal = subTotal - discount;

  if (cart.length === 0) {
    return (
      <div className="mt-20 text-center space-y-4">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Looks like you haven't added anything yet.
        </p>

        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {cart.map((item) => {
          const subtotal = item.product.price * item.quantity;

          return (
            <Card key={item.product.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted">
                    <ProgressiveImage
                      thumbnailSrc={item.product.thumbnail}
                      highResSrc={
                        item.product.image || item.product.images?.[0]
                      }
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold">{item.product.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.product.price)}
                    </p>
                    <p className="text-sm font-medium">Subtotal: {formatPrice(subtotal)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-md border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>

                    <span className="px-3 text-sm font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      removeFromCart(item.product.id);
                      toast.success("Item removed from cart");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="lg:sticky lg:top-20 h-fit">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="space-y-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDiscount(0);
                      setAppliedCoupon(null);
                      toast.success("Coupon removed");
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={applyCoupon}>
                    Apply
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Try: SAVE10, SAVE5, EXTRA10, WELCOME5
              </p>
              {appliedCoupon && (
                <p className="text-xs text-green-600 font-medium">
                  {COUPONS[appliedCoupon].label} applied
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={deliveryFree ? "flex items-center gap-2" : ""}>
                  {deliveryFree ? (
                    <>
                      <span className="line-through text-muted-foreground">
                        {formatPrice(DEFAULT_DELIVERY_FEE)}
                      </span>
                      <span className="text-green-600 font-medium">Free</span>
                    </>
                  ) : (
                    formatPrice(DELIVERY_FEE)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>{formatPrice(PLATFORM_FEE)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <Button className="w-full" asChild>
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
