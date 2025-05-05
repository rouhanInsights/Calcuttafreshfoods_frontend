"use client";

import React, {useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Search, MapPin, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { cart } = useCart();
  const { user, logout  } = useAuth();

  const totalItems = cart.items.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null; 
  return (
    <header className="w-full bg-white shadow-sm py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            width={150}
            height={80}
            alt="Brand Logo"
            priority
          />
        </Link>

        {/* Search Inputs */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <InputWithIcon
            icon={Search}
            placeholder="Search for products..."
            className="rounded-md border-gray-300 min-w-0 flex-1"
          />
          <InputWithIcon
            icon={MapPin}
            placeholder="Search location..."
            className="rounded-md border-gray-300 min-w-0 flex-1 hidden md:block"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden md:flex gap-1 hover:bg-gray-100 text-gray-700"
          >
            <Menu className="h-4 w-4" />
            <span>Shop by Category</span>
          </Button>

          <Link
            href="/myorder"
            className="hidden md:block text-gray-700 hover:text-gray-600 text-sm"
          >
            My Orders
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center text-gray-700 hover:text-gray-600"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="ml-1 hidden md:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Avatar + Login/Logout Button */}
          {user ? (
            <>
              <Link href="/profile">
                <Avatar>
                  <AvatarImage
                    src={user.profile_image_url || "https://i.pravatar.cc/150?img=10"}
                    alt="User"
                  />
                  <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <Button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                style={{ backgroundColor: "#81991f", color: "#ffffff" }}
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
