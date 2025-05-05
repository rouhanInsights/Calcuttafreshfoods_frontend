"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onSuccess: () => void; // callback to reload address list
};

export const AddAddressForm = ({ onSuccess }: Props) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("✅ Address added!");
        setForm({
          name: "",
          phone: "",
          address_line1: "",
          address_line2: "",
          address_line3: "",
          city: "",
          state: "",
          pincode: "",
          is_default: false,
        });
        onSuccess(); // refresh list
      } else {
        alert("Add failed: " + data.error);
      }
    } catch (err) {
      alert("Error adding address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Add New Address</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
        <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />
        <Input name="address_line1" value={form.address_line1} onChange={handleChange} placeholder="Address Line 1" required />
        <Input name="address_line2" value={form.address_line2} onChange={handleChange} placeholder="Address Line 2" />
        <Input name="address_line3" value={form.address_line3} onChange={handleChange} placeholder="Address Line 3" />
        <Input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
        <Input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
        <Input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" required />
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_default" checked={form.is_default} onChange={handleChange} />
          <label htmlFor="is_default">Set as default address</label>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button type="submit" className="bg-green-600 text-white" disabled={loading}>
          {loading ? "Saving..." : "Save Address"}
        </Button>
        {successMsg && <span className="text-green-600 text-sm">{successMsg}</span>}
      </div>
    </form>
  );
};
