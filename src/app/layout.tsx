"use client";

import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { ProductOfferBanner } from "@/components/Banner/ProductBanner";
import { CartProvider } from "@/context/CartContext";
import { ReactNode } from "react";
import "./globals.css";
import { FloatingCart } from "@/components/FloatingCart/FloatingCart";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <AuthProvider>
            <ProductOfferBanner />
            <Navbar />
            <main>{children}</main>
            <FloatingCart />
            <Footer />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
