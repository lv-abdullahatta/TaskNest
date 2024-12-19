"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain, Mail, Lock, User, Phone } from "lucide-react";
import Link from "next/link";
import { login, register, sendVerificationEmail, sendPhoneVerification } from "@/lib/auth";
import toast, { Toaster } from "react-hot-toast";

function AuthPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const form = searchParams ? searchParams.get("form") : null;
    if (form === "register") {
      setIsLogin(false);
    }
  }, [searchParams]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Logged in successfully!");
        router.push("/Pages/dashboard");
      } else {
        await register(email, password, name);
        await sendVerificationEmail();
        toast.success("Registered successfully! Please check your email for verification.");
        if (phone) {
          await sendPhoneVerification();
          toast.success("Phone verification code sent!");
        }
      }
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Toaster />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-2xl font-bold">
            <Mountain className="h-8 w-8 mr-2 text-primary" />
            Tickr<span className="text-primary">✔</span>it
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              <span className="text-pink-600">{isLogin ? "Login to " : "Create an "}</span>
              {isLogin ? "Tickr✔it" : "Account"}
            </h2>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
          <div className="p-4 bg-muted">
            <p className="text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" onClick={toggleForm} className="ml-1">
                {isLogin ? "Register" : "Login"}
              </Button>
            </p>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          By registering, you agree to our{" "}
          <Link href="/Pages/terms-of-service" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/Pages/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
