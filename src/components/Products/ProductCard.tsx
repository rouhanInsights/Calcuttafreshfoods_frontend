"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  image: string;
  weight?: string;
  discount?: number;
  in_stock?: boolean;
};

export const ProductCard = ({
  id,
  name,
  description,
  price,
  sale_price,
  image,
  weight,
  discount,
  in_stock,
}: Product) => {
  // console.log("Product:", { name, in_stock, type: typeof( in_stock )});
  const { cart, addToCart, removeFromCart } = useCart();
  const quantity = cart.items.find((item) => item.id === id)?.quantity || 0;

  const displayPrice = sale_price || price;
  const originalPrice = sale_price ? price : null;

  const shortDesc = description
    ? description.split(" ").slice(0, 8).join(" ") + "..."
    : null;

  return (
    <div className="relative flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg border border-gray-100">
      {/* Image */}
      <Link
        href={`/products/${id}`}
        className="flex flex-col flex-grow cursor-pointer"
      >
        <div className="relative w-full h-52 bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={name || "Product Image"}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              <Image
                src="/cp2.webp"
                alt="Fallback Product Image"
                fill
                className="object-cover"
              />
            </div>
          )}
          {discount && discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>
      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Clickable Content */}
        <Link
          href={`/products/${id}`}
          className="flex flex-col flex-grow cursor-pointer"
        >
          <h2 className="text-md font-semibold text-gray-900 mb-1 line-clamp-2 hover:underline">
            {name}
          </h2>
          {shortDesc && (
            <p className="text-sm text-gray-500 mb-1">{shortDesc}</p>
          )}
          <p className="text-xs text-gray-400 mb-2">
            {weight || "Standard Pack"}
          </p>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold text-[#006b3d]">
              ₹{displayPrice}
            </span>
            {originalPrice && (
              <span className="text-sm text-[#18A558] line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </Link>

        {/* Add to Cart / Quantity */}
        <div className="mt-3">
          {!in_stock ? (
            // Out of stock button
            <button
              disabled
              className="w-full mt-1 py-2 bg-white border border-gray-300 text-red-500 text-sm rounded-full flex justify-center items-center cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : quantity > 0 ? (
            <div className="flex justify-center">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden text-sm w-32">
                <button
                  onClick={() => removeFromCart(id)}
                  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 flex justify-center items-center"
                >
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center font-medium text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    addToCart({ id, name, price: displayPrice, image, weight })
                  }
                  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 flex justify-center items-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() =>
                addToCart({ id, name, price: displayPrice, image, weight })
              }
              className="w-full mt-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full flex justify-center items-center transition"
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
