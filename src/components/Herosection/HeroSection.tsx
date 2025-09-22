"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiShoppingCart } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type HeroContent = {
  heading: React.ReactNode;
  subheading: string;
};

const images = ["hero-bg1.webp", "hero-bg2.webp", "hero-bg3.webp", "hero-bg4.webp"];

const contentMap: Record<string, HeroContent> = {
  "hero-bg1.webp": {
    heading: (
      <>
        Fresh Fish & Meat Delivered <br />
        to Your Doorstep
      </>
    ),
    subheading: "Experience the goodness of freshness. Either it's fresh or it's free!",
  },
  "hero-bg2.webp": {
    heading: (
      <>
        Farm-Fresh Chicken Delivered <br />
        Right to Your Doorstep
      </>
    ),
    subheading: "Juicy, and flavorful — because your family deserves the best.",
  },
  "hero-bg3.webp": {
    heading: (
      <>
        Juicy Mutton Cuts Delivered <br />
        Fresh to Your Kitchen
      </>
    ),
    subheading: "Hand-selected, tender, and 100% fresh. Taste the richness with every bite.",
  },
  "hero-bg4.webp": {
    heading: (
      <>
        Premium Prawns Packed <br />
        With Ocean Freshness
      </>
    ),
    subheading: "Cleaned, deveined, and ready to cook — savor the taste of the sea!",
  },
};

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { token } = useAuth();
  const [greeting, setGreeting] = useState("");

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/greetings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data?.greeting) setGreeting(data.greeting);
      } catch (err) {
        console.error("Greeting fetch failed:", err);
      }
    };
    if (token) fetchGreeting();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = `/${src}`;
    });
  }, []);

  const handleScrollToOffers = () => {
    const target = document.getElementById("exclusive-offers");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  const bgImage = images[currentIndex];
  const selectedContent = contentMap[bgImage];

  return (
    <section
      role="region"
      aria-label="Hero carousel"
      /* Key fixes:
         - overflow-hidden keeps absolute children from spilling into next section
         - min-heights keep mobile layout stable
         - padding-top helps if you have a fixed header
      */
      className="relative w-full min-h-[560px] md:min-h-[560px] flex items-end md:items-center justify-start bg-cover bg-center transition-all duration-1000 ease-in-out overflow-hidden pt-4 md:pt-0"
      style={{ backgroundImage: `url(/${bgImage})` }}
    >
      {/* Dark overlay sits below content */}
      <div className="absolute bg-black/50 z-[1] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-[2] text-left w-full px-5 sm:px-8 pb-0 md:pb-0 max-w-xl">
        {selectedContent && (
          <>
            {greeting && (
              <p className="text-white text-sm sm:text-base md:text-lg font-medium mb-3 md:mb-4 drop-shadow">
                {greeting}
              </p>
            )}
            <h1 className="text-white text-3xl sm:text-4xl md:text-4xl font-bold leading-tight mb-3 md:mb-4 drop-shadow-lg">
              {selectedContent.heading}
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl mb-6 md:mb-8 drop-shadow-lg">
              {selectedContent.subheading}
            </p>

            <Link href="/products/all">
              <Button
                onClick={handleScrollToOffers}
                size="lg"
                className="bg-[#006b3d] hover:bg-[#18A558] text-white px-6 sm:px-8 py-5 text-base sm:text-lg transition-transform hover:scale-105 animate-float"
              >
                <FiShoppingCart />
                Shop Now
              </Button>
            </Link>

            <p className="mt-4 text-white text-sm sm:text-base font-medium">
              *Got a question? We&apos;re here to help — (+91) 9123929282
            </p>

            {/* Dots Indicator */}
            <div className="flex justify-start mt-6 md:mt-8 space-x-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    currentIndex === index ? "bg-white" : "bg-gray-400"
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Diagonal Divider */}
      {/* <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white z-10 transition-colors duration-300 ease-in-out"
        style={{
          clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)",
        }}
      ></div> */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white z-10"></div>
    </section>
  );
}
