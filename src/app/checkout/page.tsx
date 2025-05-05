"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@headlessui/react";

type Address = {
  address_id: number;
  name: string;
  phone: string;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
};

type Slot = {
  slot_id: number;
  slot_details: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { cart, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);

  const totalPrice = cart.items.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.name || !user.phone || !user.email) {
        alert("Please complete your profile before placing an order.");
        router.push("/profile");
      }
    }
  }, [loading, user]);

  useEffect(() => {
    fetch("http://localhost:5000/api/slots")
      .then((res) => res.json())
      .then(setSlots);

    fetch("http://localhost:5000/api/users/addresses")
      .then((res) => res.json())
      .then(setAddresses);
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedSlot || !selectedDate) {
      alert("Please select delivery address, date and slot.");
      return;
    }

    const orderPayload = {
      user_id: user!.user_id,
      address_id: selectedAddress,
      slot_id: selectedSlot,
      slot_date: selectedDate,
      payment_method: paymentMethod,
      total_price: totalPrice.toFixed(2),
      items: cart.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity || 1,
        price: item.price,
      })),
    };

    setPlacing(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        router.push("/orders/success?order_id=" + data.order_id);
      } else {
        alert("Order failed: " + data.error);
      }
    } catch (err) {
      alert("Something went wrong while placing the order.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading checkout...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

      {/* Address */}
      <div>
        <h2 className="font-semibold mb-2">Select Delivery Address</h2>
        <RadioGroup value={selectedAddress} onChange={setSelectedAddress}>
          <div className="grid gap-4">
            {addresses.map((addr) => (
              <RadioGroup.Option key={addr.address_id} value={addr.address_id}>
                {({ checked }) => (
                  <div className={`p-4 border rounded ${checked ? "border-green-500" : "border-gray-300"}`}>
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-sm text-gray-500">
                      {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Slot */}
      <div>
        <h2 className="font-semibold mb-2">Select Delivery Date & Time</h2>
        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <div className="mt-4 grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.slot_id}
              onClick={() => setSelectedSlot(slot.slot_id)}
              className={`p-2 border rounded ${selectedSlot === slot.slot_id ? "bg-green-500 text-white" : "border-gray-300"}`}
            >
              {slot.slot_details}
            </button>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div>
        <h2 className="font-semibold mb-2">Payment Method</h2>
        <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
          <div className="flex gap-4">
            <RadioGroup.Option value="COD">
              {({ checked }) => (
                <div className={`px-4 py-2 border rounded ${checked ? "border-green-500" : "border-gray-300"}`}>
                  Cash on Delivery
                </div>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="Razorpay">
              {({ checked }) => (
                <div className={`px-4 py-2 border rounded ${checked ? "border-green-500" : "border-gray-300"}`}>
                  Razorpay (Coming Soon)
                </div>
              )}
            </RadioGroup.Option>
          </div>
        </RadioGroup>
      </div>

      {/* Summary */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-bold mb-2">Order Summary</h2>
        <ul className="space-y-2">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name} × {item.quantity || 1}</span>
              <span>₹{(item.price || 0) * (item.quantity || 1)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4 font-bold">
          <span>Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Button className="bg-green-600 text-white w-full" onClick={handlePlaceOrder} disabled={placing}>
        {placing ? "Placing Order..." : "Place Order"}
      </Button>
    </div>
  );
}
