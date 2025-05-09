"use client";

import { useEffect, useState } from "react";
import { fetchAllProducts } from "@/lib/fetchProducts";
import { ProductCard } from "@/components/Products/ProductCard";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Something went wrong while fetching products.");
      });
  }, []);

  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!products.length) return <p className="text-gray-500 p-4">Loading products...</p>;

  return (
    <section className="py-4 px-4 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
