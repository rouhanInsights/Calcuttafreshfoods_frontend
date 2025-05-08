"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";

import {
  Search,
  MapPin,
  ShoppingCart,
  LogOut,
  User,
  ClipboardList,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { fetchCategories } from "@/lib/fetchCategories";

type Category = {
  category_id: number;
  category_name: string;
};

type Product = {
  id: number;
  name: string;
};

export const Navbar = () => {
  const router = useRouter();
  const { cart } = useCart();
  const { user, token, logout } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = debounce(async (query: string) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?search=${query}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion Fetch Error", err);
    }
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchSuggestions(val);
    setActiveIndex(-1);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/searchitems?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      router.push(
        `/searchitems?query=${encodeURIComponent(
          suggestions[activeIndex].name
        )}`
      );
      setSearchTerm("");
      setSuggestions([]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  const totalItems = cart.items.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  if (!mounted) return null;

  return (
    <header className="w-full bg-white shadow-sm py-3 px-4 md:px-8 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            width={130}
            height={40}
            alt="Brand Logo"
            priority
            className="h-auto w-auto"
          />
        </Link>

        {/* Search + Location */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative" ref={suggestionBoxRef}>
              <InputWithIcon
                ref={inputRef}
                icon={Search}
                placeholder="Search for products..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="rounded-md border-gray-300 w-full outline-none focus-visible:ring-0 focus-visible:outline-none"
              />

              {suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                  {suggestions.map((item, index) => (
                    <div
                      key={item.id}
                      className={`px-4 py-2 cursor-pointer text-sm ${
                        index === activeIndex
                          ? "bg-green-100 text-green-800 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                      onMouseDown={() => {
                        router.push(
                          `/searchitems?query=${encodeURIComponent(item.name)}`
                        );
                        setSuggestions([]);
                        setSearchTerm("");
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          <InputWithIcon
            icon={MapPin}
            placeholder="Location..."
            className="rounded-md border border-gray-300 w-48 focus-visible:ring-0 focus-visible:outline-none hidden md:block"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="text-sm font-medium px-4 py-2 bg-white border border-gray-300 rounded-md 
             hover:bg-gray-100 transition-colors flex items-center gap-1 
             focus:outline-none focus-visible:ring-0"
            >
              Shop by Category
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white border border-gray-200 shadow-lg mt-2 w-56 max-h-72 overflow-y-auto rounded-md"
              align="start"
            >
              <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">
                Available Product Categories
              </div>
              <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />
              {categories.map((cat) => (
                <DropdownMenuItem asChild key={cat.category_id}>
                  <Link
                    href={`/category/${cat.category_id}`}
                    className="block w-full px-3 py-2 text-sm rounded-md transition hover:bg-gray-100 cursor-pointer"
                  >
                    {cat.category_name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
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

          {/* Profile or Login */}
          {token && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer px-2 py-1 border border-gray-300 rounded-full hover:shadow-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profile_image_url || "/images/user.png"}
                      alt="User"
                    />
                    <AvatarFallback>
                      {user.name?.[0]?.toUpperCase() || "UI"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 hidden md:inline">
                    Profile
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-46 py-2 bg-white border border-gray-200 shadow-lg rounded-md"
                align="end"
              >
                <div className="px-3 py-1.5 text-sm text-muted-foreground font-medium">
                  My Account
                </div>
                <DropdownMenuSeparator className="my-2 h-px bg-gray-300" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-gray-100 cursor-pointer"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/myorder"
                    className="flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-gray-100 cursor-pointer"
                  >
                    <ClipboardList className="w-4 h-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 h-px bg-gray-200" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-red-50 text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button style={{ backgroundColor: "#81991f", color: "#ffffff" }}>
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
