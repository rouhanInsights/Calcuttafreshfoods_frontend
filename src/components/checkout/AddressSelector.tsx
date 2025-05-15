"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
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

type Props = {
  selected: number | null;
  onChange: (id: number) => void;
};

export default function AddressSelector({ selected, onChange }: Props) {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

   fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAddresses(data);
        }
      })
      .catch((err) => console.error("Failed to fetch addresses", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-gray-500">Loading addresses...</p>;

  if (addresses.length === 0)
    return <p className="text-sm text-red-500">No saved addresses found.</p>;

  return (
    <RadioGroup value={selected} onChange={onChange}>
      <div className="grid gap-4">
        {addresses.map((addr) => (
          <RadioGroup.Option key={addr.address_id} value={addr.address_id}>
            {({ checked }) => (
              <div
                className={`p-4 border rounded ${
                  checked ? "border-green-500" : "border-gray-300"
                }`}
              >
                <p className="font-medium">{addr.name}</p>
                <p className="text-sm text-gray-500">
                  {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-xs text-gray-400">Phone: {addr.phone}</p>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
