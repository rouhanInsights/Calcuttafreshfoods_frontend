"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

  // ✅ Local 9 AM validation for same-day delivery
  const now = new Date();
  const selected = new Date(selectedDate);
  const isSameDay =
    now.toDateString() === selected.toDateString();

  const nineAM = new Date();
  nineAM.setHours(9, 0, 0, 0);

  if (isSameDay && now > nineAM) {
    toast.warning("Same-day delivery is only available before 9:00 AM. Please choose another date.");
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`, {
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
      if (data.cutoff_violation) {
        alert("❗Same-day delivery cutoff passed. Please select another date.");
      } else {
        throw new Error(data.error || "Order placement failed");
      }
      return;
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
