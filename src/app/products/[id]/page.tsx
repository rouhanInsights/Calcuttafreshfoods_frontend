"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/products/${id}`)
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

  if (loading) return <p className="p-4">Loading...</p>;
  if (!product) return <p className="p-4 text-red-500">Product not found</p>;

  const {
    name,
    image,
    price,
    sale_price,
    weight,
    description,
    discount,
  } = product;

  const displayPrice = parseFloat(sale_price) || parseFloat(price);
  const originalPrice = sale_price ? parseFloat(price) : null;
  const discountValue = parseInt(discount, 10);

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Image Block */}
        <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4"
          />
          {discountValue > 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
              {discountValue}% OFF
            </span>
          )}
        </div>

        {/* Info Block */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-sm text-gray-600">{weight}</p>
          <p className="text-gray-500 text-sm">{description}</p>

          <div className="text-lg font-semibold text-gray-900">
            ₹{displayPrice}
            {originalPrice && (
              <span className="text-base text-gray-400 line-through ml-2">
                ₹{originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-4 px-5 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
