"use client";

import React from "react";
import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  weight?: string;
  discount?: number;
};

type ProductSliderProps = {
  products: Product[];
};

export const ProductSlider = ({ products }: ProductSliderProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-4">
      {products.map((product) => (
        <div key={product.id} className="min-w-[250px]">
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            weight={product.weight ?? ""}
            discount={product.discount}
          />
        </div>
      ))}
    </div>
  );
};
