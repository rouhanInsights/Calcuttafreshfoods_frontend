"use client";

import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FiShoppingCart } from "react-icons/fi";
type HeroContent = {
  heading: React.ReactNode;
  subheading: string;
};

import { useAuth } from "@/context/AuthContext";
const images = [
  "hero-bg1.webp",
  "hero-bg2.webp",
  "hero-bg3.webp",
  "hero-bg4.webp",
];

const contentMap: Record<string, HeroContent> = {
  "hero-bg1.webp": {
    heading: (
      <>
        Fresh Fish & Meat Delivered <br />
        to Your Doorstep
      </>
    ),
    subheading:
      "Experience the goodness of freshness. Either it's fresh or it's free!",
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
    subheading:
      "Hand-selected, tender, and 100% fresh. Taste the richness with every bite.",
  },
  "hero-bg4.webp": {
    heading: (
      <>
        Premium Prawns Packed <br />
        With Ocean Freshness
      </>
    ),
    subheading:
      "Cleaned, deveined, and ready to cook — savor the taste of the sea!",
  },
};

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const { token } = useAuth();
  const [greeting, setGreeting] = useState("");
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/greetings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (data?.greeting) setGreeting(data.greeting);
      } catch (err) {
        console.error("Greeting fetch failed:", err);
      }
    };

    if (token) {
      fetchGreeting();
    }
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
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const bgImage = images[currentIndex];
  const selectedContent = contentMap[bgImage];

  return (
    <section
      role="region"
      aria-label="Hero carousel"
      className="relative w-full h-[400px] md:h-[550px] flex items-center justify-start bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(/${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-left ml-8 px-8 max-w-xl">
        {selectedContent && (
          <>
              {greeting && (
                <p className="text-white text-base md:text-lg font-medium mb-4 drop-shadow animate-fadeIn">
                  {greeting}
                </p>
              )}
            <h1 className="text-white text-4xl md:text-4xl font-bold leading-tight mb-4 drop-shadow-lg">
              {selectedContent.heading}
            </h1>
            <p className="text-white text-lg md:text-xl mb-8 drop-shadow-lg">
              {selectedContent.subheading}
            </p>

            {/* Floating animated Button */}
            <Button
              onClick={handleScrollToOffers}
              size="lg"
              className="bg-[#81991f] hover:bg-[#6fa31e] text-white px-8 py-6 text-lg transition-transform hover:scale-105 animate-float"
            >
              <FiShoppingCart />
              Shop Now
            </Button>

            <p className="mt-4 text-white font-medium">
              *Got a question? We&aposre here to help — +91 123456 7890
            </p>

            {/* Dots Indicator */}
            <div className="flex justify-start mt-8 space-x-2">
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

      {/* Navigation Buttons */}
      <button
        aria-label="Previous slide"
        onClick={goPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
      >
        <FaChevronLeft size={20} />
      </button>

      <button
        aria-label="Next slide"
        onClick={goNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Diagonal Divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white z-10 transition-colors duration-300 ease-in-out"
        style={{
          clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)",
        }}
      ></div>
    </section>
  );
}
