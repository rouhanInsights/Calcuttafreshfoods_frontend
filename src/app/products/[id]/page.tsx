"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

// Dummy product data (can be replaced with backend fetch later)
const products = [
  {
    id: "1",
    name: "Fresh Rohu Fish",
    price: 399,
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800&h=600",
    weight: "500g",
    description: "A freshwater fish known for its delicious taste and soft meat.",
    discount: 10,
  },
  {
    id: "2",
    name: "Boneless Chicken Breast",
    price: 249,
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&h=600",
    weight: "500g",
    description: "Tender boneless chicken breasts, perfect for grilling or curry.",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found.
        <Link href="/" className="text-green-600 ml-2">Go Home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-green-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg shadow-md w-full h-auto object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-2">{product.weight}</p>
            <p className="text-gray-500 mb-6">{product.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-green-600 text-2xl font-bold">₹{product.price}</span>
              {product.discount && (
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
