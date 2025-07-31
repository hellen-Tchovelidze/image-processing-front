

"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") || "";
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


  const handleVerify = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/auth/verify-email`, {
        email,
        otpCode: Number(otp),
      });

      const token = res.data.token;
      if (token) {
        
        Cookies.set("access_token", token, { expires: 1, path: "/" });
      }

      toast.success("Verification successful!");
      await router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${baseURL}/auth/resend-verification-code`, {
        email,
      });
      toast.success("Code resent!");
      setResendCooldown(30);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Resend failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white p-4">
      <div className="w-full max-w-md p-6 bg-zinc-800 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
        <p className="text-sm mb-4">
          Enter the OTP code sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.trim())}
          maxLength={6}
          className="mb-4"
        />

        <Button
          onClick={handleVerify}
          disabled={loading || otp.length !== 5}
          className="w-full mb-2"
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>

        <Button
          variant="outline"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="w-full"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
        </Button>
      </div>
    </div>
  );
}
