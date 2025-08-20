"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AddressForm = {
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  floor_no: string;
  landmark: string;
};
type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};
type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
  mode?: "add" | "edit";
  initialData?: Partial<AddressForm & { address_id: number }>;
};

export default function AddAddressForm({
  onSuccess,
  onCancel,
  mode = "add",
  initialData = {},
}: Props) {
  const [form, setForm] = useState<AddressForm>({
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
  const [fetchingLocation, setFetchingLocation] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || !data.results.length) return;

    const result = data.results[0];
    const comps = result.address_components;

    const get = (type: string) =>
      (comps as AddressComponent[]).find((c) => c.types.includes(type))
        ?.long_name || "";

    const updatedFields = {
      address_line1: result.formatted_address.split(",")[0] || "",
      city: get("locality") || get("administrative_area_level_2") || "",
      state: get("administrative_area_level_1") || "",
      pincode: get("postal_code") || "",
    };

    setForm((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await reverseGeocode(latitude, longitude);
        setFetchingLocation(false);
      },
      (error) => {
        alert("Failed to fetch location.");
        console.error("Geolocation error:", error);
        setFetchingLocation(false);
      },
      { timeout: 15000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        mode === "edit"
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/addresses/${initialData.address_id}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/addresses`;

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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {mode === "edit" ? "Edit Address" : "Add New Address"}
        </h3>
        <Button
          type="button"
          onClick={handleUseLocation}
          className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100"
        >
          📍 {fetchingLocation ? "Fetching..." : "Use My Location"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
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
          className="sm:col-span-2"
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Input
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
