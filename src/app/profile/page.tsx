"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileForm from "@/components/Profile/ProfileForm";
import { AddressManager } from "@/components/Addressmanager/AddressManager";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-10">
      <ProfileForm />
      <AddressManager />
    </div>
  );
}
