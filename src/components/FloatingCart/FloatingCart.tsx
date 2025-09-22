"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export const FloatingCart = () => {
  const { cart } = useCart();

  const totalItems = cart.items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-20 md:right-6 z-50">
      <Link href="/cart"><Button  style={{color: "#ffffff", boxShadow: "0 3px 5px #90B09C" }}
        className="bg-[#006b3d] hover:bg-[#18A558] text-white h-14 w-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
        aria-label="View Cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            {totalItems}
          </span>
        )}
      </Button></Link>
    </div>
  );
};
