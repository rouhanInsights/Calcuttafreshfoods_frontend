"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "@/components/Herosection/HeroSection";
import { QuickLinks } from "@/components/QuickLinks/QuickLinks";
import { CategoryBanner } from "@/components/CategoryGrid/CategoryGrid";
import { ProductsSection } from "@/components/Products/ProductsSection";
// import { MobileApp } from "@/components/Mobileapp/MobileApp";
import {
  fetchAllProducts,
  fetchTopOffers,
  fetchBestSellers,
} from "@/lib/fetchProducts";

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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [topOffers, setTopOffers] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllProducts(), fetchTopOffers(), fetchBestSellers()])
      .then(([all, offers, best]) => {
        setAllProducts(all.slice(0, 6));
        setTopOffers(offers.slice(0, 6));
        setBestSellers(best.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load homepage data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading products...</p>;

  return (
    <>
      <HeroSection />
      <QuickLinks />
      <ProductsSection
        title="Top Offers"
        products={topOffers}
        viewAllLink="/products/top-offers"
      />

      <ProductsSection
        title="Best Sellers"
        products={bestSellers}
        viewAllLink="/products/best-sellers"
      />

      <ProductsSection
        title="All Products"
        products={allProducts}
        viewAllLink="/products/all"
      />

      <CategoryBanner />
      {/* <MobileApp /> */}
    </>
  );
}
