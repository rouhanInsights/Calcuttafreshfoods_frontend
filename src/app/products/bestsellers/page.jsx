"use client";

import { useEffect, useState } from "react";
import { fetchAllProducts } from "@/lib/fetchProducts";
import { ProductCard } from "@/components/Products/ProductCard";

export default function BestSellersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then((data) => {
        const bestSellers = [...data]
          .sort((a, b) => a.stock_quantity - b.stock_quantity)
          .slice(0, 6);
        setProducts(bestSellers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Best Sellers Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading best sellers...</p>;

  return (
    <section className="py-8 px-4 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Best Sellers</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No best sellers found</p>
        )}
      </div>
    </section>
  );
}
