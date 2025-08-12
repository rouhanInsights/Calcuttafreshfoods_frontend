"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, addToCart, clearCart } = useCart();
  const items = cart.items;
  const { user } = useAuth();

  const subtotal = items.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0
  );
  const totalItems = items.reduce(
    (total, item) => total + (item.quantity ?? 1),
    0
  );
  const deliveryCharges = 30;
  const totalAmount = subtotal + deliveryCharges;

  if (!items.length) {
    return (
      <section className="py-20 text-center flex flex-col items-center">
        <Image
          src="/emptycart.webp"
          alt="empty cart"
          width={160}
          height={160}
          className="mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Your cart is empty
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Looks like you haven’t added anything yet.
        </p>
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
            <ShoppingCart className="mr-2 h-4 w-4" /> Browse Products
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const hasDiscount = item.discount && item.discount > 8;
              const showMRP = item.sale_price && item.sale_price < item.price;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="relative w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                    {hasDiscount && (
                      <span className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {item.name}
                    </h3>{" "}
                    {/* Font size increased */}
                    <p className="text-sm text-gray-500">{item.weight}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-green-600 font-bold text-md">
                        ₹{item.price}
                      </span>
                      {showMRP && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{item.sale_price}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border rounded-full overflow-hidden">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 font-medium text-sm">
                          {item.quantity ?? 1}
                        </span>
                        <button
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                              weight: item.weight,
                              sale_price: item.sale_price,
                              description: item.description,
                              discount: item.discount,
                            })
                          }
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-700 font-semibold">
                  ₹{deliveryCharges}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-md">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full border-red-700 bg-red-50 text-gray-700"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              {user ? (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => router.push("/login")}
                >
                  Login to Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
