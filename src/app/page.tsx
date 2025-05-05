"use client";

import React from "react";
import HeroSection from "@/components/Herosection/HeroSection";
import { QuickLinks } from "@/components/QuickLinks/QuickLinks";
import { CategoryBanner } from "@/components/CategoryGrid/CategoryGrid";
import { ProductsSection } from "@/components/Products/ProductsSection";
import { MobileApp } from "@/components/Mobileapp/MobileApp";

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

const bestSellers = [
  {
    id: "6",
    name: "Best Seller",
    price: 299,
    image: "https://placehold.co/400",
    weight: "1kg",
    discount: 8,
  },
  {
    id: "7",
    name: "Best Seller",
    price: 599,
    image: "https://placehold.co/400",
    weight: "500g",
  },
  {
    id: "8",
    name: "Best Seller",
    price: 599,
    image: "https://placehold.co/400",
    weight: "500g",
  },
  {
    id: "9",
    name: "Best Seller",
    price: 599,
    image: "https://placehold.co/400",
    weight: "500g",
  },
  {
    id: "10",
    name: "Best Seller",
    price: 599,
    image: "https://placehold.co/400",
    weight: "500g",
  },
];

const topOffers = [
  {
    id: "11",
    name: "Top Offer",
    price: 199,
    image: "https://placehold.co/400",
    weight: "500g",
    discount: 15,
  },
  {
    id: "12",
    name: "Top Offer",
    price: 299,
    image: "https://placehold.co/400",
    weight: "1kg",
  },
  {
    id: "13",
    name: "Top Offer",
    price: 299,
    image: "https://placehold.co/400",
    weight: "1kg",
  },
  {
    id: "14",
    name: "Top Offer",
    price: 299,
    image: "https://placehold.co/400",
    weight: "1kg",
  },
  {
    id: "15",
    name: "Top Offer",
    price: 299,
    image: "https://placehold.co/400",
    weight: "1kg",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <QuickLinks />

      {/* Products Sections */}
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
      <MobileApp />
    </>
  );
}
