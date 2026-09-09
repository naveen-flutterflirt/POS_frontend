"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { useCachedFetch } from "@/hooks/useCachedFetch";

export default function CreateCashierPage() {
  const { post } = useApi();
  const { data: rawStores } = useCachedFetch<any[]>("/store", { cacheKey: "cache:stores", staleTtl: 30_000 });
  
  const stores = Array.isArray(rawStores) ? rawStores : [];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    store: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.mobile,
        role: "CASHIER",
        store: formData.store,
      })
      .then(() => {
        window.location.href = "/admin/dashboard/cashier";
      })
      .catch((error) => {
        console.error("Failed to create cashier:", error);
        alert("Failed to create cashier. Check console for details.");
      });
  };

  return (
    <div className="space-y-4 font-nunito">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-medium text-gray-800 sm:text-2xl">Cashier</h1>
          <div className="mt-1 flex items-center gap-2 font-nunito text-sm text-gray-500">
            <Link href="/admin/dashboard" className="transition-colors hover:text-[#622581]">Admin</Link>
            <span className="text-lg text-gray-400">›</span>
            <Link href="/admin/dashboard/cashier" className="transition-colors hover:text-[#622581]">Cashier Management</Link>
            <span className="text-lg text-gray-400">›</span>
            <span className="text-gray-800">Create Cashier</span>
          </div>
        </div>
        <Link href="/admin/dashboard/cashier" className="mt-1 flex items-center gap-2 whitespace-nowrap font-nunito text-sm text-[#622581] transition-colors hover:text-[#4d1d67]">
          <ArrowLeft className="h-4 w-4" /> Back to Cashier Management
        </Link>
      </div>

      <div className="bg-white px-4 py-6 sm:px-9 sm:py-7">
        <h2 className="font-poppins text-base font-medium text-gray-800">Create Cashier Login</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:gap-x-16">
            <label className="font-nunito text-sm font-normal text-gray-800">
              Name
              <input required type="text" placeholder="Enter name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20" />
            </label>
            <label className="font-nunito text-sm font-normal text-gray-800">
              Email
              <input required type="email" placeholder="Enter email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20" />
            </label>
            <label className="font-nunito text-sm font-normal text-gray-800">
              Password
              <input required type="text" placeholder="Enter password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20" />
            </label>
            <label className="font-nunito text-sm font-normal text-gray-800">
              Mobile
              <input required type="tel" pattern="[0-9]{10}" title="Must be exactly 10 digits" placeholder="Enter 10-digit mobile number" value={formData.mobile} onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, '').slice(0, 10))} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20" />
            </label>
            <label className="relative font-nunito text-sm font-normal text-gray-800">
              Store
              <select required value={formData.store} onChange={(e) => updateField("store", e.target.value)} className="mt-1.5 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none transition focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20">
                <option value="">Select store</option>
                {stores.map((s: any) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" />
            </label>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="min-w-[140px] rounded-lg bg-[#622581] px-8 py-2.5 font-poppins text-lg font-medium text-white transition-colors hover:bg-[#52206d]">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
