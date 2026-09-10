"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession } from "aws-amplify/auth";

const roles = [
  {
    href: "/admin/login",
    label: "Admin Login",
    desc: "Manage your store, products & reports",
    color: "bg-[#622581] hover:bg-[#52206d]",
  },
  {
    href: "/cashier/login",
    label: "Cashier Login",
    desc: "Process sales, returns & billing",
    color: "bg-[#1463ff] hover:bg-blue-700",
  },
  {
    href: "/inventory/login",
    label: "Inventory Login",
    desc: "Track stock, manage inventory levels",
    color: "bg-[#0f9e6e] hover:bg-emerald-700",
  },
];

export default function RootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Check if user is an Admin (uses AWS Amplify)
        const session = await fetchAuthSession();
        if (session.tokens?.accessToken) {
          router.replace("/admin/dashboard");
          return;
        }
      } catch (err) {
        // No active Amplify session, continue checking local storage
      }

      // 2. Check Local Storage for Cashier or Inventory (uses custom backend)
      const token = localStorage.getItem("access_token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          
          // Redirect based on user's role or permissions
          // Note: adjust these checks if your user object has a specific 'role' field
          if (user.posAccess) {
            router.replace("/cashier/dashboard");
            return;
          } else if (user.inventoryAccess || user.role === "inventory") {
            router.replace("/inventory/dashboard");
            return;
          }
          
          // If we can't determine specific role but they have a token, you could fallback
          // router.replace("/dashboard");
        } catch (e) {
          console.error("Error parsing user data from local storage", e);
        }
      }

      // 3. Not logged in, show the role selection page
      setChecking(false);
    };

    checkAuth();
  }, [router]);

  if (checking) {
    // Show a blank screen or a loader while checking auth state to prevent flicker
    return <div className="min-h-screen bg-[#f8f9fb]" />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] px-4 py-10">
      <div className="w-full max-w-4xl">

        {/* Logo + title */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="relative h-14 w-14">
            <Image src="/Images/icon.svg" alt="FlutterFlirt POS" fill className="object-contain" />
          </div>
          <h1 className="font-poppins text-3xl font-bold text-gray-900">FlutterFlirt POS</h1>
          <p className="font-nunito text-sm text-gray-500">Select your role to continue</p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {roles.map(({ href, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <span
                className={`inline-flex items-center justify-center rounded-xl px-6 py-2.5 font-poppins text-sm font-semibold text-white transition-colors ${color}`}
              >
                {label}
              </span>
              <p className="text-center font-nunito text-xs text-gray-500">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
