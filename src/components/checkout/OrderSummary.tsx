"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  onPlaceOrder: () => void;
  loading: boolean;
};

export default function OrderSummary({ onPlaceOrder, loading }: Props) {
  const { cart } = useCart();

  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0
  );
  const deliveryCharge = 30;
  const totalAmount = subtotal + deliveryCharge;
  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Order Summary
      </h3>

      <ul className="text-sm text-gray-700 space-y-2 mb-4">
        {cart.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.quantity ?? 1}
            </span>
            <span>₹{item.price * (item.quantity ?? 1)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-sm mb-2 mt-2">
        <span>Delivery Charges:</span>
        <span className="text-green-700 font-semibold">₹{deliveryCharge}</span>
      </div>
      <div className="flex justify-between font-semibold text-md border-t pt-3 text-gray-900">
        <span>Total</span>
        <span>₹{totalAmount.toFixed(2)}</span>
      </div>

      <button
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={onPlaceOrder}
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
