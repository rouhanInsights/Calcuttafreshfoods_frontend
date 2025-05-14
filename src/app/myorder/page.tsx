"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";

type OrderItem = {
  product_id: number;
  name: string;
  image_url: string;
  quantity: number;
  price: number;
};

type Order = {
  order_id: number;
  total_price: string; // ✅ comes as string
  status: string;
  order_date: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user?.user_id || !token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/user/${user.user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("Invalid orders:", data);
          setOrders([]);
        }
      })
      .catch((err) => {
        console.error("Fetch failed", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [token, user]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading orders...</div>;
  }

  if (!orders.length) {
    return <div className="p-8 text-center text-gray-500">No orders found.</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">🧾 My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.order_id}
          className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">
                Placed on: {format(new Date(order.order_date), "dd MMM yyyy")}
              </p>
              <p className="text-sm capitalize text-gray-600">
                Status: <span className="font-medium text-green-700">{order.status}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-semibold text-[#8BAD2B]">
                ₹{parseFloat(order.total_price || "0").toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {order.items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center gap-4 border rounded-lg p-3"
              >
                <Image
                width={200}
                height={100}
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover border"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/orders/success?order_id=${order.order_id}`)}
              className="border-[#8BAD2B] text-[#8BAD2B] hover:bg-[#f5fdec]"
            >
              View Details
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${order.order_id}/invoice`,
                  "_blank"
                )
              }
            >
              Download Invoice
            </Button>
          </div>
        </div>
      ))}
    </main>
  );
}
