"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Fish & Seafood",
    image: "/images/fish.png",
    description: "Freshwater and seawater fish varieties",
    url: "/category/2",
  },
  {
    name: "Premium Chicken",
    image: "/images/meat.jpg",
    description: "Farm-raised chicken cuts and whole pieces",
    url: "/category/4",
  },
  {
    name: "Tender Mutton",
    image: "/images/mutton.png",
    description: "Premium quality mutton curated for your favorite dishes",
    url: "/category/3",
  }
];

export const CategoryBanner = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg group h-60"
            >
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-black/50"
                style={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "overlay",
                  transition: "transform 0.3s ease",
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-6 text-white z-10">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm mb-4 opacity-90">{category.description}</p>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black w-fit group-hover:translate-x-2 transition-transform"
                  asChild
                >
                  <Link href={category.url}>
                    Explore <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
