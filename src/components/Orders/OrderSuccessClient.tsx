"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

// ✅ Define Order Type
type OrderItem = {
  product_id: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
};

type Order = {
  order_id: number;
  total_price: number;
  status: string;
  order_date: string;
  payment_method: string;
  address_name: string;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
  address_phone: string;
  items: OrderItem[];
};

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderId, token]);

  if (loading) {
    return <div className="text-center py-20">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center py-20 text-red-600">Order not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-green-600">🎉 Thank you for your order!</h1>
      <p className="text-gray-700">
        Your order ID is <strong>#{order.order_id}</strong>. A confirmation email will be sent shortly.
      </p>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.product_id} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-sm mb-2 mt-2">
        <span>Delivery Charges:</span>
        <span className="text-green-700 font-semibold">₹30</span>
      </div>
        <div className="mt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{Number(order.total_price).toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-gray-50 p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <p className="text-sm text-gray-700">
          {order.address_name}<br />
          {order.address_line1}, {order.city}, {order.state} - {order.pincode}<br />
          📞 {order.address_phone}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          className="bg-green-600 text-white"
          onClick={() =>
            window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${order.order_id}/invoice`, "_blank")
          }
        >
          📄 Download Invoice
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
        >
          🔙 Back to Home
        </Button>
      </div>
    </div>
  );
}
