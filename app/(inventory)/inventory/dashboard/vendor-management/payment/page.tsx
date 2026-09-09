"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

const vendorOptions  = ["Narayana", "Vendor A", "Vendor B"];
const paymentTypes   = ["UPI", "Cash", "Card"] as const;
type PaymentType = (typeof paymentTypes)[number];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition";

export default function VendorPaymentDetailsPage() {
  const router = useRouter();

  const [vendorName,   setVendorName]   = useState("");
  const [paymentType,  setPaymentType]  = useState<PaymentType | "">("");
  const [refNumber,    setRefNumber]    = useState("");
  const [paymentDate,  setPaymentDate]  = useState("");
  const [paidAmount,   setPaidAmount]   = useState("");
  const [description,  setDescription]  = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/inventory/dashboard/vendor-management");
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">
            Vendor Management
          </h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Inventory</span>
            <span className="text-base leading-none">›</span>
            <span>Vendor management</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Vendor Payment Details</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/inventory/dashboard/vendor-management")}
          className="mt-1 flex items-center gap-1.5 font-nunito text-sm font-semibold text-[#622581] hover:text-[#52206d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Product Management
        </button>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white px-6 py-7 sm:px-8">
        <h2 className="mb-6 font-poppins text-base font-semibold text-gray-900">
          Vendor Payment Details
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 lg:gap-x-16">

            {/* Vendor Name — dropdown */}
            <div className="font-nunito text-sm text-gray-800">
              Vendor Name
              <div className="relative mt-1.5">
                <select
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition cursor-pointer"
                >
                  <option value="" disabled>Choose Stock</option>
                  {vendorOptions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Payment Type — radio buttons */}
            <div className="font-nunito text-sm text-gray-800">
              Payment Type
              <div className="mt-2.5 flex flex-wrap items-center gap-8">
                {paymentTypes.map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-2 font-nunito text-sm text-gray-500 select-none"
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      value={type}
                      checked={paymentType === type}
                      onChange={() => setPaymentType(type)}
                      className="h-4 w-4 cursor-pointer accent-[#622581]"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Reference Number */}
            <div className="font-nunito text-sm text-gray-800">
              Payment Reference Number
              <input
                placeholder="Enter mobile number"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Payment Date */}
            <div className="font-nunito text-sm text-gray-800">
              Payment Date
              <input
                placeholder="Enter Pin-Code"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Paid Amount */}
            <div className="font-nunito text-sm text-gray-800">
              Paid Amount
              <input
                placeholder="Enter Pin-Code"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Description — textarea */}
            <div className="font-nunito text-sm text-gray-800">
              Description
              <textarea
                rows={5}
                placeholder="Write a short description here...."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end">
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
