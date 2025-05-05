"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOtp = async () => {
    setSending(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          identifier.includes("@") ? { email: identifier } : { phone: identifier }
        ),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("temp_user", identifier);
        router.push("/otp");
      } else {
        setError(data.error || "Failed to send OTP.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 bg-white shadow rounded-md space-y-4">
      <h2 className="text-xl font-bold text-gray-700">🔐 Login with OTP</h2>
      <Input
        placeholder="Phone or Email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button onClick={handleSendOtp} disabled={sending || !identifier}>
        {sending ? "Sending..." : "Send OTP"}
      </Button>
    </div>
  );
}
