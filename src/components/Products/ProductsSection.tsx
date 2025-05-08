"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ProductSlider } from "./ProductSlider";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  image: string;
  weight?: string;
  discount?: number;
};

type ProductsSectionProps = {
  title: string;
  products: Product[];
  viewAllLink: string;
};

export const ProductsSection = ({
  title,
  products,
  viewAllLink,
}: ProductsSectionProps) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <Button variant="link" className="text-green-600 hover:text-green-700" asChild>
            <a href={viewAllLink}>View all</a>
          </Button>
        </div>

        <ProductSlider products={products} />
      </div>
    </section>
  );
};
