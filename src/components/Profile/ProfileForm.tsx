"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    alt_phone: "",
    email: "",
    alt_email: "",
    gender: "",
    dob: "",
    profile_image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            alt_phone: data.alt_phone || "",
            email: data.email || "",
            alt_email: data.alt_email || "",
            gender: data.gender || "",
            dob: data.dob ? data.dob.split("T")[0] : "",
            profile_image_url: data.profile_image_url || "",
          });
        } else {
          setErrorMsg("Failed to load profile.");
        }
      } catch {
        setErrorMsg("Error fetching profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("✅ Profile updated successfully!");
        setForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          alt_phone: data.user.alt_phone || "",
          email: data.user.email || "",
          alt_email: data.user.alt_email || "",
          gender: data.user.gender || "",
          dob: data.user.dob ? data.user.dob.split("T")[0] : "",
          profile_image_url: data.user.profile_image_url || "",
        });
      } else {
        setErrorMsg("Update failed: " + (data.error || "Unknown error"));
      }
    } catch {
      setErrorMsg("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-700">My Profile</h2>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {successMsg && <p className="text-green-600">{successMsg}</p>}

      <div className="grid md:grid-cols-2 gap-4">
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
          placeholder="Phone Number"
          required
        />
        <Input
          name="alt_phone"
          value={form.alt_phone}
          onChange={handleChange}
          placeholder="Alternate Phone (Optional)"
        />
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <Input
          name="alt_email"
          value={form.alt_email}
          onChange={handleChange}
          placeholder="Alternate Email (Optional)"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <Input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
        />
        <Input
          name="profile_image_url"
          value={form.profile_image_url}
          onChange={handleChange}
          placeholder="Profile Image URL (optional)"
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="submit"
          className="bg-green-600 text-white"
          disabled={loading}
        >
          {loading ? "Saving..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}
