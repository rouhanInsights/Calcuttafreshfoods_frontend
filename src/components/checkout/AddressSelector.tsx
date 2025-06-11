"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { RadioGroup } from "@headlessui/react";
import { CheckCircle, Plus, X } from "lucide-react";
import AddAddressForm from "@/components/Addressmanager/AddAddressForm";
import { Button } from "@/components/ui/button";

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
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAddresses(data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  if (loading) return <p className="text-gray-500">Loading addresses...</p>;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        
        <Button
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          {showForm ? "Cancel" : "Add Address"}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-gray-50 border p-5">
          <AddAddressForm
            mode="add"
            onSuccess={() => {
              fetchAddresses();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {addresses.length === 0 ? (
        <p className="text-sm text-red-500">No saved addresses found.</p>
      ) : (
        <RadioGroup value={selected} onChange={onChange}>
          <div className="grid gap-4">
            {addresses.map((addr) => (
              <RadioGroup.Option key={addr.address_id} value={addr.address_id}>
                {({ checked }) => (
                  <div
                    className={`relative p-4 border rounded cursor-pointer ${
                      checked ? "border-green-600 bg-green-100" : "border-gray-300"
                    }`}
                  >
                    {checked && (
                      <div className="absolute top-2 right-2 text-green-600">
                        <CheckCircle size={30} />
                      </div>
                    )}
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-sm text-black">
                      {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-black">Phone: {addr.phone}</p>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  );
}