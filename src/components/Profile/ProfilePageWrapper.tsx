"use client";

import React, { useState } from "react";
import ProfileForm from "./ProfileForm";
import { AddressManager } from "./AddressManager";

export default function ProfilePageWrapper() {
  const [activeTab, setActiveTab] = useState<"profile" | "address">("profile");

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

      {/* Toggle buttons */}
      <div className="flex gap-2 bg-gray-100 rounded-sm p-1 w-fit shadow-inner border border-gray-200">
        <button
          className={`px-5 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
            activeTab === "profile"
              ? "bg-[#8BAD2B] text-white shadow"
              : "text-gray-600 hover:bg-white hover:shadow-sm"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile Info
        </button>
        <button
          className={`px-5 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
            activeTab === "address"
              ? "bg-[#8BAD2B] text-white shadow"
              : "text-gray-600 hover:bg-white hover:shadow-sm"
          }`}
          onClick={() => setActiveTab("address")}
        >
          📬 Saved Addresses
        </button>
      </div>

      {/* Section rendering */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 border-t-[4px] border-t-[#8BAD2B]">
        {activeTab === "profile" ? <ProfileForm /> : <AddressManager />}
      </div>
    </section>
  );
}
