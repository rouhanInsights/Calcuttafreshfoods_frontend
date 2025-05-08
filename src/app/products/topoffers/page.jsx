"use client";

import { useEffect, useState } from "react";
import { fetchAllProducts } from "@/lib/fetchProducts";
import { ProductCard } from "@/components/Products/ProductCard";

export default function TopOffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then((data) => {
        const topOffers = data.filter(
          (product) => !isNaN(Number(product.discount)) && Number(product.discount) >= 10
        );
        setProducts(topOffers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Top Offers Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading top offers...</p>;

  return (
    <section className="py-8 px-4 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Top Offers</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No top offers available</p>
        )}
      </div>
    </section>
  );
}
