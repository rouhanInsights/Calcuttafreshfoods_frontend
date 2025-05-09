"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const { cart, removeFromCart, addToCart, clearCart } = useCart();

  const items = cart.items;

  const subtotal = items.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0
  );
  const totalItems = items.reduce(
    (total, item) => total + (item.quantity ?? 1),
    0
  );

  if (!items.length) {
    return (
      <section className="py-20 text-center">
        <Image
          src="/emptycart.webp"
          alt="empty cart"
          width={160}
          height={160}
          className="mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>
        <Link href="/">
          <Button className="bg-green-600 text-white hover:bg-green-700">
            Browse Products
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {items.map((item) => {
            const hasDiscount = item.discount && item.discount > 8;
            const showMRP = item.sale_price && item.sale_price < item.price;

            return (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
                <div className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                  {hasDiscount && (
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow">
                      {item.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.weight}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-green-700 font-semibold text-md">
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
                        className="w-8 h-8 flex justify-center items-center bg-gray-100 hover:bg-gray-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-medium text-gray-700">
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
                        className="w-8 h-8 flex justify-center items-center bg-gray-100 hover:bg-gray-200"
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

        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span>Subtotal:</span>
            <span className="font-semibold text-green-700">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push("/checkout")}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
