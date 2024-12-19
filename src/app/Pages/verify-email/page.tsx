"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmVerification } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const userId = searchParams?.get("userId");
    const secret = searchParams?.get("secret");

    if (userId && secret) {
      confirmVerification(userId, secret)
        .then(() => {
          toast.success("Email verified successfully!");
          setVerifying(false);
        })
        .catch((error) => {
          console.error("Verification error:", error);
          toast.error("Email verification failed. Please try again.");
          setVerifying(false);
        });
    } else {
      setVerifying(false);
      toast.error("Invalid verification link.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Toaster />
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {verifying ? (
          <p>Verifying your email...</p>
        ) : (
          <Button onClick={() => router.push("/Pages/dashboard")}>Go to Dashboard</Button>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <p>Loading verification...</p>
        </div>
      }>
      <VerifyEmailContent />
    </Suspense>
  );
}
