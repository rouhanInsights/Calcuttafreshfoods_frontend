"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export const AddressManager = () => {
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "John",
      phone: "9876543210",
      address_line1: "123 Park St",
      city: "Kolkata",
      state: "WB",
      pincode: "700001",
    },
    {
      id: "2",
      name: "John",
      phone: "9876543210",
      address_line1: "Flat 22, South City",
      city: "Mumbai",
      state: "MH",
      pincode: "400001",
    },
  ]);

  const handleRemove = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Delivery Addresses</h2>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add Address
        </Button>
      </div>
      <div className="space-y-4">
        {addresses.map(addr => (
          <div key={addr.id} className="border rounded p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{addr.name}</p>
              <p className="text-sm text-gray-500">{addr.phone}</p>
              <p className="text-sm">{addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
            </div>
            <Button onClick={() => handleRemove(addr.id)} variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
