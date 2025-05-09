"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import AddressSelector from "@/components/checkout/AddressSelector";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentOption from "@/components/checkout/PaymentOptions";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedSlot || !selectedDate || !token) {
      alert("Please complete all fields before placing order.");
      return;
    }

    const orderItems = cart.items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity ?? 1,
      price: item.price,
    }));

    const total_price = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const payload = {
      address_id: selectedAddress,
      slot_id: selectedSlot,
      slot_date: selectedDate,
      payment_method: paymentMethod,
      items: orderItems,
      total_price,
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Order response:", data);
      if (!res.ok) {
        throw new Error(data.error || "Order placement failed");
      }

      clearCart();
      router.push(`/orders/success?order_id=${data.order_id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      alert("Error placing order: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

      {/* Address Selection */}
      <div className="mb-8">
        <h2 className="text-md font-medium mb-2">Select Delivery Address</h2>
        <AddressSelector
          selected={selectedAddress}
          onChange={setSelectedAddress}
        />
      </div>

      {/* Slot + Date Selection */}
      <div className="mb-8">
        <CheckoutForm
          date={selectedDate}
          slot={selectedSlot}
          onDateChange={setSelectedDate}
          onSlotChange={setSelectedSlot}
        />
      </div>

      {/* Payment Method */}
      <div className="mb-8">
        <PaymentOption selected={paymentMethod} onChange={setPaymentMethod} />
      </div>

      {/* Order Summary + CTA */}
      <OrderSummary onPlaceOrder={handlePlaceOrder} loading={loading} />
    </section>
  );
}
