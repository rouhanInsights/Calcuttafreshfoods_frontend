"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function OtpScreen() {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const identifier =
    typeof window !== "undefined" ? localStorage.getItem("temp_user") : "";

  useEffect(() => {
    if (!identifier) {
      router.push("/");
    }
  }, [identifier, router]);

  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVerifyOtp = async () => {
    setVerifying(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            identifier?.includes("@")
              ? { email: identifier, otp }
              : { phone: identifier, otp }
          ),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        login(data.token);
        localStorage.removeItem("temp_user");
        router.push("/");
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!identifier || cooldown > 0) return;
    setResending(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            identifier.includes("@")
              ? { email: identifier }
              : { phone: identifier }
          ),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend OTP.");
      } else {
        setCooldown(60);
      }
    } catch {
      setError("Failed to resend. Please check your connection.");
    } finally {
      setResending(false);
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
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          inputMode="numeric"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8BAD2B] bg-white/80 placeholder-gray-500 text-sm tracking-widest text-center"
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button
          onClick={handleVerifyOtp}
          disabled={verifying || otp.length !== 6}
          className="w-full bg-[#046B3B] hover:bg-[#18A558] text-white py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </Button>

        <Button
          variant="outline"
          onClick={handleResendOtp}
          disabled={resending || cooldown > 0}
          className="w-full"
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}
