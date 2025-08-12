"use client";

import { useEffect, useState } from "react";
import { fetchBestSellers } from "@/lib/fetchProducts";
import { ProductCard } from "@/components/Products/ProductCard";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  image: string;
  weight: string;
  discount?: number;
  stock_quantity: number;
};

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null); // ✅ Correct type here

  useEffect(() => {
    fetchBestSellers()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to fetch best sellers:", err);
        setError("Something went wrong while fetching best sellers."); // ✅ Now matches type
      });
  }, []);

  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!products.length) return <p className="text-gray-500 p-4">Loading products...</p>;

  return (
    <section className="py-4 px-4 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Best Sellers</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}