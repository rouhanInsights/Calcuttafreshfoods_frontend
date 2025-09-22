"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ProductSlider } from "./ProductSlider";
import { motion } from "framer-motion";

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
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="py-3 bg-gray-50"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <Button
            variant="link"
            className="#18A558 text-[#006b3d] hover:text-[#18A558] font-medium"
            asChild
          >
            <a href={viewAllLink}>View all</a>
          </Button>
        </div>

        <ProductSlider products={products} />
      </div>
    </motion.section>
  );
};
