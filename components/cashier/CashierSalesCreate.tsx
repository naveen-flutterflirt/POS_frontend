"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

const customerOptions = ["M.Ram", "Sita", "Lakshman", "Githa", "Chandhana"];
const cashierOptions  = ["Cashier 1", "Cashier 2", "Cashier 3"];
const paymentTypes    = ["UPI", "Cash", "Card"] as const;
type PaymentType = (typeof paymentTypes)[number];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition";

const selectWrapClass = "relative mt-1.5";
const selectClass =
  "w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition cursor-pointer";

export default function CashierSalesCreate() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    invoice:     "",
    customer:    "",
    cashier:     "",
    discount:    "",
    cgst:        "",
    sgst:        "",
    paymentType: "" as PaymentType | "",
  });

  const set = (field: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: persist new sale
    router.push("/cashier/dashboard/sales");
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">Sales</h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Cashier</span>
            <span className="text-base leading-none">›</span>
            <span>Sales Management</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Add Sale</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/cashier/dashboard/sales")}
          className="mt-1 flex items-center gap-1.5 font-nunito text-sm font-semibold text-[#622581] hover:text-[#52206d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Sales Management
        </button>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white px-6 py-7 sm:px-8">
        <h2 className="font-poppins text-base font-semibold text-gray-900">Add Sale</h2>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 lg:gap-x-24">

            {/* Invoice Number */}
            <label className="font-nunito text-sm text-gray-800">
              Invoice Number
              <input
                required
                placeholder="Enter Invoice Number"
                value={formData.invoice}
                onChange={(e) => set("invoice", e.target.value)}
                className={inputClass}
              />
            </label>

            {/* Customer */}
            <label className="font-nunito text-sm text-gray-800">
              Customer
              <div className={selectWrapClass}>
                <select
                  required
                  value={formData.customer}
                  onChange={(e) => set("customer", e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>Select Customer</option>
                  {customerOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            {/* Cashier */}
            <label className="font-nunito text-sm text-gray-800">
              Cashier
              <div className={selectWrapClass}>
                <select
                  required
                  value={formData.cashier}
                  onChange={(e) => set("cashier", e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>Select Cashier</option>
                  {cashierOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            {/* Discount */}
            <label className="font-nunito text-sm text-gray-800">
              Discount
              <input
                placeholder="Enter Discount"
                value={formData.discount}
                onChange={(e) => set("discount", e.target.value)}
                className={inputClass}
              />
            </label>

            {/* CGST */}
            <label className="font-nunito text-sm text-gray-800">
              CGST
              <input
                placeholder="Enter CGST"
                value={formData.cgst}
                onChange={(e) => set("cgst", e.target.value)}
                className={inputClass}
              />
            </label>

            {/* SGST */}
            <label className="font-nunito text-sm text-gray-800">
              SGST
              <input
                placeholder="Enter SGST"
                value={formData.sgst}
                onChange={(e) => set("sgst", e.target.value)}
                className={inputClass}
              />
            </label>

            {/* Payment Type — full width on its own row */}
            <div className="font-nunito text-sm text-gray-800 md:col-span-2">
              Payment Type
              <div className="mt-2.5 flex flex-wrap items-center gap-8">
                {paymentTypes.map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-2 font-nunito text-sm text-gray-600 select-none"
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      value={type}
                      checked={formData.paymentType === type}
                      onChange={() => set("paymentType", type)}
                      className="h-4 w-4 cursor-pointer accent-[#622581]"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
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
