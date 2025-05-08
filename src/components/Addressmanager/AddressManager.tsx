"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddAddressForm from "./AddAddressForm";

type Address = {
  address_id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

export const AddressManager = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/addresses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setAddresses(data);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
      setAddresses([]);
    }
  };

  const deleteAddress = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        fetchAddresses();
      } else {
        alert("Failed to delete address: " + data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting address");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">My Addresses</h2>

      {addresses.length === 0 && (
        <p className="text-gray-500">No addresses found.</p>
      )}

      <ul className="space-y-4">
        {addresses.map((addr) => (
          <li key={addr.address_id} className="border p-4 rounded-lg relative">
            <p className="font-medium">{addr.name}</p>
            <p>{addr.address_line1}</p>
            <p>{addr.address_line2}</p>
            <p>
              {addr.city}, {addr.state} - {addr.pincode}
            </p>
            <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
            {addr.is_default && (
              <span className="text-green-600 font-semibold text-sm">
                Default
              </span>
            )}
            <Button
              variant="outline"
              className="absolute top-2 right-2 text-red-600 border-red-400 hover:bg-red-50"
              onClick={() => deleteAddress(addr.address_id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>

      <AddAddressForm onSuccess={fetchAddresses} />
    </div>
  );
};
