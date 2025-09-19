"use client";
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
  }

  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayInstance {
    open(): void;
  }
}

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddressSelector from "@/components/checkout/AddressSelector";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentOption from "@/components/checkout/PaymentOptions";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePlaceOrder = async () => {
    if (!token) {
      toast.custom(() => (
        <div className="bg-gray-50 border border-gray-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-gray-800 text-sm max-w-sm w-full">
          <div className="text-xl">🔐</div>
          <div className="flex-1">
            <p className="font-semibold">You’re not logged in</p>
            <p className="text-xs leading-snug mt-0.5">
              Please Login to place your order.
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
            <Button
              variant={"ghost"}
              className="mt-3 hover:bg-red-100 border border-red-200 text-red-800 animated fade-in"
              onClick={() => router.push("/profile")}
            >
              Add Address <ChevronRightIcon />
            </Button>
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
    // ✅ Same-day slot logic
    const now = new Date();
    const selected = new Date(selectedDate);
    const isSameDay = now.toDateString() === selected.toDateString();
    const sixAM = new Date();
    sixAM.setHours(6, 0, 0, 0);

    if (isSameDay && now > sixAM && selectedSlot === 1) {
      toast.custom(() => (
        <div className="bg-orange-50 border border-orange-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-orange-900 text-sm max-w-sm w-full">
          <div className="text-xl">⚠️</div>
          <div className="flex-1">
            <p className="font-semibold">Early slot not available</p>
            <p className="text-xs leading-snug mt-0.5">
              Orders placed after 6:00 AM today can only be delivered in the
              10–12 slot.
            </p>
          </div>
        </div>
      ));
      return;
    }
    // ✅ Minimum order check
    const cartSubtotal = cart.items.reduce((sum, item) => {
  return sum + item.price * (item.quantity ?? 1);
}, 0);


    if (cartSubtotal < 300) {
      toast.custom(() => (
        <div className="bg-orange-50 border border-orange-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-orange-900 text-sm max-w-sm w-full">
          <div className="text-xl">⚠️</div>
          <div className="flex-1">
            <p className="font-semibold">Minimum order value not met</p>
            <p className="text-xs leading-snug mt-0.5">
              Your cart total is ₹{cartSubtotal}. Minimum order value is ₹300.
            </p>
            <Button
              variant={"ghost"}
              onClick={() => router.push("/products/all")}
              className="mt-2 text-green-700 border border-green-600 hover:bg-green-50 font-medium text-sm"
            >
              ➕ Add Products
            </Button>
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

      if (paymentMethod === "COD") {
        // ✅ Direct order placement for COD
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Order failed");

        clearCart();
        toast.success("✅ Order placed successfully!");
        router.push(`/orders/success?order_id=${data.order_id}`);
        return;
      }

      // ✅ Step 1: Create Razorpay Order
      const razorRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: total_price + 30 }),
        }
      );

      const razorData = await razorRes.json();
      if (!razorRes.ok) throw new Error("Failed to create payment order");

      // ✅ Step 2: Open Razorpay Checkout
      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: razorData.amount,
        currency: razorData.currency,
        name: "Calcutta Fresh Foods",
        description: "Secure Payment",
        order_id: razorData.order_id,
        handler: async function () {
          // ✅ Step 3: Place Order after Payment
          const finalPayload = {
            ...payload,
            payment_method: paymentMethod,
          };

          const orderRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(finalPayload),
            }
          );

          const orderData = await orderRes.json();
          if (!orderRes.ok) throw new Error(orderData?.error || "Order failed");

          clearCart();
          toast.success("✅ Payment & Order Successful!");
          router.push(`/orders/success?order_id=${orderData.order_id}`);
        },
        prefill: {
          email: "", // Optional: fill with user email if available
          contact: "", // Optional: fill with phone if available
        },
        theme: {
          color: "#8BAD2B",
        },
      });

      razorpay.open();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.custom(() => (
        <div className="bg-red-50 border border-red-300 rounded-md px-4 py-2 shadow flex items-start gap-3 text-red-900 text-sm max-w-sm w-full">
          <div className="text-xl">❌</div>
          <div className="flex-1">
            <p className="font-semibold">Order failed</p>
            <p className="text-xs leading-snug mt-0.5">{message}</p>
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
