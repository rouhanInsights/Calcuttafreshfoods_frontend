"use client";

import React from "react";
import { ProductCard } from "@/components/Products/ProductCard";

const allProducts = [
    {
      id: "1",
      name: "Product name",
      price: 399,
      image: "https://placehold.co/400",
      weight: "500g",
      discount: 10,
    },
    {
      id: "2",
      name: "Product name",
      price: 249,
      image: "https://placehold.co/400",
      weight: "500g",
    },
    {
      id: "3",
      name: "Product name",
      price: 599,
      image: "https://placehold.co/400",
      weight: "500g",
      discount: 5,
    },
    {
      id: "4",
      name: "Product name",
      price: 449,
      image: "https://placehold.co/400",
      weight: "1kg",
    },
    {
      id: "5",
      name: "Product name",
      price: 449,
      image: "https://placehold.co/400",
      weight: "1kg",
    },
  ];

export default function AllProductsPage() {
  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
      <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{/* Page Title */}</h1>

            <a
                href="/"
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
                Back to Home
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
                </svg>
            </a>
            </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
