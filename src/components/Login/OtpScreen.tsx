"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OtpScreen() {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const identifier = typeof window !== "undefined" ? localStorage.getItem("temp_user") : "";

  useEffect(() => {
    if (!identifier) router.push("/");
  }, [identifier]);

  const handleVerifyOtp = async () => {
    setVerifying(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          identifier?.includes("@")
            ? { email: identifier, otp }
            : { phone: identifier, otp }
        ),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.removeItem("temp_user");
        router.push("/profile");
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 bg-white shadow rounded-md space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Enter OTP</h2>
      <Input
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button onClick={handleVerifyOtp} disabled={verifying || otp.length !== 6}>
        {verifying ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
}
