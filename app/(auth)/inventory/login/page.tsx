"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/context/ApiContext";

export default function InventoryLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { post } = useApi();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await post("/auth/login", { email, password });
      
      // Assume token comes back in response.access_token
      if (response && response.access_token) {
        localStorage.setItem("access_token", response.access_token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        router.push("/inventory/dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] p-1 sm:p-4">
      <div className="grid min-h-[calc(100vh-8px)] w-full max-w-[1060px] overflow-hidden bg-white shadow-sm md:min-h-[600px] md:grid-cols-2 md:rounded-none">

        {/* ── Left: image ── */}
        <div className="relative hidden min-h-[600px] md:block">
          <Image
            src="/Images/Signup.jpg"
            alt="Inventory manager using a retail POS system"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-8 bottom-28 text-center lg:bottom-24">
            <p className="font-poppins text-4xl font-semibold leading-tight text-white drop-shadow-lg lg:text-5xl">
              Welcome Back,
              <br />
              Inventory!
            </p>
          </div>
        </div>

        {/* ── Right: form ── */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:bg-white md:px-9 lg:px-12">
          <div className="w-full max-w-[505px] rounded-[22px] bg-[#f7f7f7] px-7 py-14 sm:px-10 md:px-8 lg:px-10 lg:py-16">
            <h1 className="mb-9 text-center font-poppins text-3xl font-bold text-black sm:text-4xl">
              Inventory Login
            </h1>

            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-2 block font-nunito text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <div>
                <label className="mb-2 block font-nunito text-sm font-semibold text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <div className="text-right">
                <Link
                  href="/inventory/forgot-password"
                  className="font-nunito text-xs font-semibold text-gray-500 hover:text-[#1463ff]"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="pt-1 text-center font-nunito text-xs text-gray-500">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/inventory/signup"
                  className="font-semibold text-gray-500 underline hover:text-[#1463ff]"
                >
                  Sign Up
                </Link>
              </p>

              <p className="text-center font-nunito text-xs text-gray-500">
                Are you an admin?{" "}
                <Link
                  href="/admin/login"
                  className="font-semibold text-gray-500 underline hover:text-[#1463ff]"
                >
                  Admin Login
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
