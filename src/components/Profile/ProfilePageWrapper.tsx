"use client";

import React from "react";
import ProfileForm from "./ProfileForm";
import { AddressManager } from "./AddressManager";
import LocationStatusCard from "@/components/Profile/LocationStatusCard";

export default function ProfilePageWrapper() {

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 border-t-[4px] border-t-[#8BAD2B] mt-8">
        <ProfileForm />
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 border-t-[4px] border-t-[#8BAD2B]">
        <AddressManager />
      </div>

      {/* ✅ Map between address section and footer */}
      <LocationStatusCard />
    </section>
  );
}
