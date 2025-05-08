"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const totalItems = cart.items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <section className="py-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

        {cart.items.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow flex gap-4"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.weight}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-bold text-green-600">₹{item.price}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Summary</h2>
              <div className="flex justify-between text-sm mb-2">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>Subtotal:</span>
                <span className="font-semibold text-green-700">
                  ₹{subtotal}
                </span>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
