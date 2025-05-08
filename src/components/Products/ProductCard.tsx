"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Plus, Minus } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  image: string;
  weight?: string;
  price: number;
  sale_price?: number;
  description?: string;
};

export const ProductCard = ({
  id,
  name,
  image,
  weight,
  price,
  sale_price,
  description,
}: Product) => {
  const { addToCart, removeFromCart, cart } = useCart();

  const displayPrice = sale_price || price;
  const originalPrice = sale_price ? price : null;
  const discountPercent =
    sale_price && price ? Math.round(((price - sale_price) / price) * 100) : 0;
    console.log(name, "→ Price:", price, "Sale Price:", sale_price, "Discount %:", discountPercent);
  const quantity = cart.items.find((item) => item.id === id)?.quantity || 0;

  const shortDesc = description
    ? description.split(" ").slice(0, 8).join(" ") + "..."
    : "";

  const handleAdd = () => {
    addToCart({ id, name, price: displayPrice, image, weight });
  };

  const handleRemove = () => {
    removeFromCart(id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image + Discount */}
      <div className="relative w-full h-50 bg-gray-100 rounded-t-xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {discountPercent > 0 && (
          <span className="absolute z-10 top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
          {discountPercent}% OFF
        </span>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href="#" className="block">
          <h2 className="text-base font-semibold text-gray-900 line-clamp-2 hover:underline">
            {name}
          </h2>
        </Link>

        {shortDesc && (
          <p className="text-sm text-gray-500 mt-1 mb-1 line-clamp-2">
            {shortDesc}
          </p>
        )}
        <p className="text-xs text-gray-400 mb-2">
          {weight || "Standard Pack"}
        </p>

        <div className="mt-auto flex items-center justify-between">
          {/* Price Block */}
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-gray-900">
              ₹{displayPrice}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Add/Stepper */}
          {quantity > 0 ? (
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden text-sm">
              <button
                onClick={handleRemove}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 flex justify-center items-center"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-medium text-gray-800">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 flex justify-center items-center"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full flex items-center transition"
            >
              <ShoppingCart size={16} className="mr-1" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
