"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

const customerOptions = ["M.Ram", "Sita", "Lakshman", "Githa", "Chandhana"];
const refundTypes     = ["Cash", "UPI", "Card"] as const;

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition";
const selectWrapClass = "relative mt-1.5";
const selectClass =
  "w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition cursor-pointer";

export default function CashierReturnsCreate() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    invoice:    "",
    customer:   "",
    mobile:     "",
    product:    "",
    qty:        "",
    refundType: "",
    approvedBy: "",
  });

  const set = (field: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/cashier/dashboard/returns");
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">Returns</h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Cashier</span>
            <span className="text-base leading-none">›</span>
            <span>Returns Management</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Add Return</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/cashier/dashboard/returns")}
          className="mt-1 flex items-center gap-1.5 font-nunito text-sm font-semibold text-[#622581] hover:text-[#52206d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Returns Management
        </button>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white px-6 py-7 sm:px-8">
        <h2 className="font-poppins text-base font-semibold text-gray-900">Add Return</h2>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 lg:gap-x-24">

            <label className="font-nunito text-sm text-gray-800">
              Invoice Number
              <input required placeholder="Enter Invoice Number" value={formData.invoice} onChange={(e) => set("invoice", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Customer
              <div className={selectWrapClass}>
                <select required value={formData.customer} onChange={(e) => set("customer", e.target.value)} className={selectClass}>
                  <option value="" disabled>Select Customer</option>
                  {customerOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Mobile No
              <input required type="tel" placeholder="Enter Mobile Number" value={formData.mobile} onChange={(e) => set("mobile", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Product
              <input required placeholder="Enter Product" value={formData.product} onChange={(e) => set("product", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Quantity
              <input required placeholder="Enter Quantity" value={formData.qty} onChange={(e) => set("qty", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Approved By
              <input placeholder="Enter Approved By" value={formData.approvedBy} onChange={(e) => set("approvedBy", e.target.value)} className={inputClass} />
            </label>

            {/* Refund Type — radio, full width */}
            <div className="font-nunito text-sm text-gray-800 md:col-span-2">
              Refund Type
              <div className="mt-2.5 flex flex-wrap items-center gap-8">
                {refundTypes.map((type) => (
                  <label key={type} className="flex cursor-pointer items-center gap-2 font-nunito text-sm text-gray-600 select-none">
                    <input
                      type="radio"
                      name="refundType"
                      value={type}
                      checked={formData.refundType === type}
                      onChange={() => set("refundType", type)}
                      className="h-4 w-4 cursor-pointer accent-[#622581]"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              className="min-w-[140px] rounded-xl bg-[#622581] px-8 py-3 font-poppins text-lg font-semibold text-white transition-colors hover:bg-[#52206d] active:scale-95"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
