"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext"; // ✅ import useCart

type ProductProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  weight?: string;
  discount?: number;
};

export const ProductCard = ({ id, name, price, image, weight, discount }: ProductProps) => {
  const { addToCart } = useCart(); // ✅ access addToCart

  const handleAddToCart = () => {
    const product = { id, name, price, image, weight, discount };
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-800 text-lg">{name}</h3>
        <p className="text-sm text-gray-600">{weight}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-green-600 font-bold text-lg">₹{price}</span>
          <Button variant="outline" size="sm" onClick={handleAddToCart}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
