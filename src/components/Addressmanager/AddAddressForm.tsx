"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
  mode?: "add" | "edit";
  initialData?: Partial<Record<string, any>>;
};

export default function AddAddressForm({
  onSuccess,
  onCancel,
  mode = "add",
  initialData = {},
}: Props) {
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

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

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
      const endpoint =
        mode === "edit"
          ? `http://localhost:5000/api/users/addresses/${initialData.address_id}`
          : "http://localhost:5000/api/users/addresses";

      const res = await fetch(endpoint, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        if (mode === "add") {
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
        }
      } else {
        alert(`${mode === "edit" ? "Update" : "Add"} failed: ` + data.error);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 space-y-6 ring-1 ring-gray-100 border-l-[4px] border-l-[#8BAD2B]"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        {mode === "edit" ? "Edit Address" : "Add New Address"}
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none"
        />
        <input
          name="address_line1"
          value={form.address_line1}
          onChange={handleChange}
          placeholder="Address Line 1"
          required
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none"
        />
        <input
          name="address_line2"
          value={form.address_line2}
          onChange={handleChange}
          placeholder="Address Line 2"
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          required
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none"
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          required
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none"
        />
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          required
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none"
        />
        <input
          name="floor_no"
          value={form.floor_no}
          onChange={handleChange}
          placeholder="Floor No. (Optional)"
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none"
        />
        <input
          name="landmark"
          value={form.landmark}
          onChange={handleChange}
          placeholder="Landmark (Optional)"
          className="px-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#8BAD2B] focus:outline-none sm:col-span-2"
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
          className="w-4 h-4 accent-[#8BAD2B]"
        />
        <span className="text-gray-700">Set as default address</span>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#8BAD2B] text-white hover:bg-[#779624] px-6"
        >
          {loading
            ? "Saving..."
            : mode === "edit"
            ? "Save Changes"
            : "Add Address"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
