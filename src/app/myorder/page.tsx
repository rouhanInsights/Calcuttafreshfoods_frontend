"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// ✅ Order types
type OrderItem = {
  product_id: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
};

type Order = {
  order_id: number;
  total_price: string;
  status: string;
  order_date: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/user/17") // Replace with auth-based ID
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-20 text-gray-600">No past orders found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">My Orders</h1>

      {orders.map((order) => (
        <div key={order.order_id} className="bg-white shadow rounded-md p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order #{order.order_id}</p>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.order_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-green-600">Status: {order.status}</p>
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-green-600 text-white"
                onClick={() => router.push(`/orders/success?order_id=${order.order_id}`)}
              >
                View Details
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`http://localhost:5000/api/orders/${order.order_id}/invoice`, "_blank")
                }
              >
                Invoice
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            {order.items.slice(0, 4).map((item) => (
              <li key={item.product_id}>
                {item.name} × {item.quantity} = ₹
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>

          <div className="font-bold text-right text-lg">
            Total: ₹{Number(order.total_price).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
