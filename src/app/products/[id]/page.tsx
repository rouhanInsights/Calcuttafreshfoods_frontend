"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
type Product = {
  name: string;
  image: string;
  price: string;
  sale_price?: string;
  weight?: string;
  description?: string;
  discount?: string;
};
export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string; // ✅ cast to string
  const { addToCart, removeFromCart, cart } = useCart();
  const quantity = cart.items.find((item) => item.id === id)?.quantity || 0;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
    }
  }, [id]);
  
  if (typeof id !== "string") {
    return <p className="p-4 text-red-500">Invalid product ID</p>;
  }
  if (loading) return <p className="p-4">Loading...</p>;
  if (!product) return <p className="p-4 text-red-500">Product not found</p>;

  const { name, image, price, sale_price, weight, description, discount } =
    product;

  const displayPrice = parseFloat(sale_price ?? price);
  const originalPrice = sale_price ? parseFloat(price) : null;
  const discountValue = parseInt(discount ?? "0", 10);

  return (
    <section className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md mt-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image Block */}
        <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
          <Image src={image} alt={name} fill className="object-contain p-4" />
          {discountValue > 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
              {discountValue}% OFF
            </span>
          )}
        </div>

        {/* Info Block */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-sm text-gray-600">{weight || "Standard Pack"}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>

          <div className="text-lg font-semibold text-gray-900">
            ₹{displayPrice.toFixed(2)}
            {originalPrice && (
              <span className="text-base text-gray-400 line-through ml-2">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            {/* ← Back Link */}
            <button
              onClick={() => window.history.back()}
              className="text-sm text-gray-500 hover:text-black"
            >
              ← Back to Products
            </button>

            {/* Add/Remove Quantity Controls */}
            {quantity > 0 ? (
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden text-sm">
                <button
                  onClick={() => removeFromCart(id)}
                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 flex justify-center items-center"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    addToCart({ id, name, price: displayPrice, image, weight })
                  }
                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 flex justify-center items-center"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  addToCart({ id, name, price: displayPrice, image, weight })
                }
                className="px-5 py-2 bg-[#8BAD2B] text-white rounded-md hover:bg-[#779624] transition font-medium"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
