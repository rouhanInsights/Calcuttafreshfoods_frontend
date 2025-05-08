"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onSuccess: () => void;
};

export default function AddAddressForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
    floor_no: "",
    landmark: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        setForm({
          name: "",
          phone: "",
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          pincode: "",
          is_default: false,
          floor_no: "",
          landmark: "",
        });
      } else {
        alert("Add failed: " + data.error);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <Input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
      />
      <Input
        name="address_line1"
        value={form.address_line1}
        onChange={handleChange}
        placeholder="Address Line 1"
        required
      />
      <Input
        name="address_line2"
        value={form.address_line2}
        onChange={handleChange}
        placeholder="Address Line 2"
      />
      <Input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        required
      />
      <Input
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder="State"
        required
      />
      <Input
        name="pincode"
        value={form.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        required
      />
      <Input
        name="floor_no"
        value={form.floor_no}
        onChange={handleChange}
        placeholder="Floor No. (Optional)"
      />
      <Input
        name="landmark"
        value={form.landmark}
        onChange={handleChange}
        placeholder="Landmark (Optional)"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
        />
        Make Default Address
      </label>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Address"}
      </Button>
    </form>
  );
}
