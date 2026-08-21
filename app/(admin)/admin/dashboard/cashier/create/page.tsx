"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function CreateCashierPage() {
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
    console.log("Cashier Data:", formData);
  };

  return (
    <div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">
            Cashier
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500">
            <Link
              href="/admin/dashboard"
              className="transition-colors hover:text-[#622581]"
            >
              Admin
            </Link>
            <span className="text-lg text-gray-400">›</span>
            <Link
              href="/admin/dashboard/cashier"
              className="transition-colors hover:text-[#622581]"
            >
              cashier Management
            </Link>
            <span className="text-lg text-gray-400">›</span>
            <span className="text-gray-800">Create Cashier</span>
          </div>
        </div>

        <Link
          href="/admin/dashboard/cashier"
          className="mt-1 flex items-center gap-2 whitespace-nowrap text-sm font-nunito text-[#622581] transition-colors hover:text-[#4d1d67]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cashier Management
        </Link>
      </div>

      <section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
        <div className="flex h-full flex-col px-9 py-7">
          <h2 className="text-base font-poppins font-medium text-gray-800">
            Create Cashier Login
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-1 flex-col"
          >
            <div className="grid grid-cols-1 gap-x-36 gap-y-4 md:grid-cols-2">
              <label className="text-sm font-normal text-gray-800">
                Name
                <input
                  required
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-2 py-2.5 text-sm font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                />
              </label>

              <label className="text-sm font-normal text-gray-800">
                Email
                <input
                  required
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-2 py-2.5 text-sm font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                />
              </label>

              <label className="text-sm font-normal text-gray-800">
                Password
                <input
                  required
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-2 py-2.5 text-sm font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                />
              </label>

              <label className="text-sm font-normal text-gray-800">
                Mobile
                <input
                  required
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={(event) => updateField("mobile", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-2 py-2.5 text-sm font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                />
              </label>

              <label className="relative text-sm font-normal text-gray-800">
                Store
                <select
                  required
                  value={formData.store}
                  onChange={(event) => updateField("store", event.target.value)}
                  className="mt-1.5 w-full appearance-none rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-sm font-normal text-gray-700 outline-none transition focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                >
                  <option value="">Select store</option>
                  <option value="Madhuvana Spices">Madhuvana Spices</option>
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" />
              </label>
            </div>

            <div className="mt-auto flex justify-end pt-6">
              <button
                type="submit"
                className="min-w-[165px] rounded-lg bg-[#622581] px-8 py-2.5 font-poppins text-xl font-medium text-white transition-colors hover:bg-[#52206d]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
