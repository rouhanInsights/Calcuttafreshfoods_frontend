"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function OtpScreen() {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const identifier =
    typeof window !== "undefined" ? localStorage.getItem("temp_user") : "";

  useEffect(() => {
    if (!identifier) router.push("/");
  }, [identifier, router]);

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
        login(data.token);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f5f8ed] to-[#ecf4e2] flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md space-y-5 border border-[#e5eed6]">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Enter OTP
        </h2>
        <Input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8BAD2B] bg-white/80 placeholder-gray-500 text-sm tracking-widest text-center"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button
          onClick={handleVerifyOtp}
          disabled={verifying || otp.length !== 6}
          className="w-full bg-[#8BAD2B] hover:bg-[#779624]"
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}
