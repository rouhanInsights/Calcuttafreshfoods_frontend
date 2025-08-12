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
  Loader2,
  RefreshCw,
  Crosshair,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { fetchCategories } from "@/lib/fetchCategories";
import AreaAutocomplete from "@/components/Location/AreaAutocomplete";

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
  const { user, token, logout, loading } = useAuth();

  const {
    pincode,
    isServiceable,
    loading: locationLoading,
    error: locationError,
    fetchUserLocation,
    fetchUserLocationPrecise,
    validatePincode,
  } = useLocation();

  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [manualPin, setManualPin] = useState(pincode || "");
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

  const fetchSuggestions = React.useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) return setSuggestions([]);
        try {
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_BASE_URL
            }/api/products?search=${encodeURIComponent(query)}`
          );
          if (!res.ok) throw new Error(`Search failed: ${res.status}`);
          const data = (await res.json()) as Product[];
          setSuggestions(data);
        } catch (err) {
          console.error("Suggestion Fetch Error", err);
        }
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      fetchSuggestions.cancel();
    };
  }, [fetchSuggestions]);

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

  // replace your locationLabel builder with:
  const locationLabel = (() => {
    if (locationLoading) {
      return (
        <span className="text-gray-500 flex items-center gap-1">
          Detecting <Loader2 className="w-3 h-3 animate-spin" />
        </span>
      );
    }
    if (locationError)
      return <span className="text-red-600">{locationError}</span>;
    if (pincode) {
      if (isServiceable === null) {
        return <span className="text-gray-600">Checking PIN {pincode}…</span>;
      }
      return (
        <span className={isServiceable ? "text-green-700" : "text-red-600"}>
          {isServiceable
            ? `Delivering to PIN ${pincode}`
            : `Not delivering to PIN ${pincode}`}
        </span>
      );
    }
    return <span className="text-gray-500">Location not set</span>;
  })();

  return (
    <header className="w-full bg-white shadow-sm py-3 px-4 md:px-8 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          aria-label="Go to homepage"
        >
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
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full"
            role="search"
          >
            <div className="relative" ref={suggestionBoxRef}>
              <InputWithIcon
                ref={inputRef}
                icon={Search}
                placeholder="Search for products..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="rounded-md border-gray-300 w-full outline-none focus-visible:ring-0 focus-visible:outline-none"
                aria-autocomplete="list"
                aria-expanded={suggestions.length > 0}
                aria-controls="search-suggestions"
              />

              {suggestions.length > 0 && (
                <div
                  id="search-suggestions"
                  className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto"
                  role="listbox"
                >
                  {suggestions.map((item, index) => (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={index === activeIndex}
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
          {/* Location status (desktop) */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="hidden md:flex items-center gap-2 text-xs text-gray-700 border border-gray-300 rounded-md px-3 h-9 min-w-[230px]"
                aria-label="Set delivery location"
              >
                <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                <div className="flex-1 truncate text-left">{locationLabel}</div>
                <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="w-[320px] p-2 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={fetchUserLocation}
                  disabled={locationLoading}
                  className="w-full text-sm border rounded-md px-3 py-2 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <MapPin className="w-4 h-4" />
                  {locationLoading ? (
                    <>
                      Auto‑detecting{" "}
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>Auto‑detect my location</>
                  )}
                </button>

                <div className="h-px bg-gray-200" />

                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (manualPin && /^\d{6}$/.test(manualPin)) {
                      validatePincode(manualPin);
                    }
                  }}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    placeholder="Enter 6‑digit PIN"
                    value={manualPin}
                    onChange={(e) =>
                      setManualPin(e.target.value.replace(/\D/g, ""))
                    }
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
                    aria-label="Enter PIN code"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="text-sm"
                    disabled={!/^\d{6}$/.test(manualPin)}
                  >
                    Check
                  </Button>
                </form>

                {!!locationError && (
                  <div className="text-xs text-red-600">{locationError}</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
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
                    className="block w-full px-3 py-2 text-sm rounded-md transition hover:bg-green-100 cursor-pointer"
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
            aria-label="Cart"
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
          {!loading &&
            (token && user ? (
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
                      className="flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-green-100 cursor-pointer"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/myorder"
                      className="flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-green-100 cursor-pointer"
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
                <Button
                  style={{ backgroundColor: "#81991f", color: "#ffffff" }}
                >
                  Login
                </Button>
              </Link>
            ))}
        </div>
      </div>

      {/* Mobile: location quick actions + Autocomplete */}
      <div className="md:hidden px-4 mt-2 space-y-2">
        <AreaAutocomplete />
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={fetchUserLocation}
            disabled={locationLoading}
            className="flex-1 text-xs border rounded-md px-3 py-2 flex items-center justify-center gap-2 disabled:opacity-60"
            aria-label="Use my location (fast)"
            title="Use my location (fast)"
          >
            <RefreshCw
              className={`w-4 h-4 ${locationLoading ? "animate-spin" : ""}`}
            />
            {locationLoading ? "Detecting…" : "Use my location"}
          </button>
          <button
            type="button"
            onClick={fetchUserLocationPrecise}
            disabled={locationLoading}
            className="flex-1 text-xs border rounded-md px-3 py-2 flex items-center justify-center gap-2 disabled:opacity-60"
            aria-label="Try precise location"
            title="Try precise location"
          >
            <Crosshair className="w-4 h-4" />
            Precise
          </button>
        </div>
        {locationError && (
          <div className="text-xs text-red-600">{locationError}</div>
        )}
        {pincode && (
          <div className="text-xs text-gray-700">
            {isServiceable === null
              ? `Checking PIN ${pincode}…`
              : isServiceable
              ? `Delivering to PIN ${pincode}`
              : `Not delivering to PIN ${pincode}`}
          </div>
        )}
      </div>
    </header>
  );
};
