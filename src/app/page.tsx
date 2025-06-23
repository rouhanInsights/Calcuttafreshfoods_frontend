"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "@/components/Herosection/HeroSection";
import { QuickLinks } from "@/components/QuickLinks/QuickLinks";
import { CategoryBanner } from "@/components/CategoryGrid/CategoryGrid";
import { ProductsSection } from "@/components/Products/ProductsSection";
// import { MobileApp } from "@/components/Mobileapp/MobileApp";
import { fetchAllProducts } from "@/lib/fetchProducts";

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading products...</p>;

  const topOffers = products
    .filter((p) => !isNaN(Number(p.discount)) && Number(p.discount) >= 10)
    .slice(0, 6);

  const bestSellers = [...products]
    .sort((a, b) => a.stock_quantity - b.stock_quantity)
    .slice(0, 6);

  const allProducts = [...products].slice(0, 6);

  return (
    <>
      <HeroSection />
      <QuickLinks />

      <ProductsSection
        title="All Products"
        products={allProducts}
        viewAllLink="/products/all"
      />

      <ProductsSection
        title="Best Sellers"
        products={bestSellers}
        viewAllLink="/products/bestsellers"
      />

      <ProductsSection
        title="Top Offers"
        products={topOffers}
        viewAllLink="/products/topoffers"
      />

      <CategoryBanner />
      {/* <MobileApp /> */}
    </>
  );
}
