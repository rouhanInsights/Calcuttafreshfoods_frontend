"use client";

import React from "react";
import { ProductCard } from "./ProductCard";

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
            description={product.description}
            price={product.price}
            sale_price={product.sale_price}
            image={product.image}
            weight={product.weight}
            discount={product.discount}
          />
        </div>
      ))}
    </div>
  );
};
