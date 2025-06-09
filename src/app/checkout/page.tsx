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
import {Button} from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react"

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
  if (!token) {
    toast.custom(() => (
      <div className="bg-gray-50 border border-gray-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-gray-800 text-sm max-w-sm w-full">
        <div className="text-xl">🔐</div>
        <div className="flex-1">
          <p className="font-semibold">You’re not logged in</p>
          <p className="text-xs leading-snug mt-0.5">
            Please  Login to place your order.
          </p>
          <Button
            className="mt-3 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => router.push("/login")}
          >
             LogIn <ChevronRightIcon />  
          </Button>
        </div>
      </div>
    ));
    return;
  }
  if (!selectedAddress) {
    toast.custom(() => (
      <div className="bg-red-50 border border-red-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-red-900 text-sm max-w-sm w-full">
        <div className="text-xl">📍</div>
        <div className="flex-1">
          <p className="font-semibold">Delivery address missing. .</p>
          <p className="text-xs leading-snug mt-0.5">
            Please select or add a delivary address before proceeding
            </p>
          <Button variant ={"ghost"}
            className="mt-3 hover:bg-red-100 border border-red-200 text-red-800 animated fade-in"
            onClick={() => router.push("/profile")}
            >Add Address <ChevronRightIcon /></Button>
        </div>
      </div>
    ));
    return;
  }

  if (!selectedSlot) {
    toast.custom(() => (
      <div className="bg-yellow-50 border border-yellow-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-yellow-900 text-sm max-w-sm w-full">
        <div className="text-xl">⏰</div>
        <div className="flex-1">
          <p className="font-semibold">Delivery time not selected</p>
          <p className="text-xs leading-snug mt-0.5">
            Please choose a delivery slot to continue.
          </p>
        </div>
      </div>
    ));
    return;
  }

  if (!selectedDate) {
    toast.custom(() => (
      <div className="bg-blue-50 border border-blue-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-blue-900 text-sm max-w-sm w-full">
        <div className="text-xl">📅</div>
        <div className="flex-1">
          <p className="font-semibold">Delivery date missing</p>
          <p className="text-xs leading-snug mt-0.5">
            Select a delivery date to place your order.
          </p>
        </div>
      </div>
    ));
    return;
  }


  // ✅ Same-day cutoff logic
  const now = new Date();
  const selected = new Date(selectedDate);
  const isSameDay = now.toDateString() === selected.toDateString();
  const nineAM = new Date();
  nineAM.setHours(9, 0, 0, 0);

  if (isSameDay && now > nineAM) {
    toast.custom(() => (
      <div className="bg-orange-50 border border-orange-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-orange-900 text-sm max-w-sm w-full">
        <div className="text-xl">⚠️</div>
        <div className="flex-1">
          <p className="font-semibold">Same-day delivery cutoff</p>
          <p className="text-xs leading-snug mt-0.5">
            Orders for today must be placed before 9:00 AM. Please select a future date.
          </p>
        </div>
      </div>
    ));
    return;
  }

  // ✅ Prepare order
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

    if (!res.ok) {
      throw new Error(data?.error || "Order failed");
    }

    clearCart();
    toast.success("✅ Order placed successfully!");
    router.push(`/orders/success?order_id=${data.order_id}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    toast.custom(() => (
      <div className="bg-red-50 border border-red-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-red-900 text-sm max-w-sm w-full">
        <div className="text-xl">❌</div>
        <div className="flex-1">
          <p className="font-semibold">Order failed</p>
          <p className="text-xs leading-snug mt-0.5">
            {message}
          </p>
        </div>
      </div>
    ));
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
