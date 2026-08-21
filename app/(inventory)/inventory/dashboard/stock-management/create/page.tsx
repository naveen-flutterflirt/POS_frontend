"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

const storeOptions  = ["Madhuvana", "Store 2", "Store 3"];
const vendorOptions = ["S. Neha", "Vendor 2", "Vendor 3"];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition";

const selectWrap = "relative mt-1.5";
const selectClass =
  "w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition cursor-pointer";

export default function AddStockPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    productId:       "",
    stockName:       "",
    stockCode:       "",
    batchNumber:     "",
    uom:             "",
    quantity:        "",
    manufacturedDate:"",
    expiredDate:     "",
    stockValue:      "",
    receivedDate:    "",
    store:           "",
    transportCost:   "",
    paymentStatus:   "",
    vendor:          "",
    invoiceNumber:   "",
    cgst:            "",
    igst:            "",
    sgst:            "",
    description:     "",
  });

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/inventory/dashboard/stock-management");
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">
            Stock Management
          </h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Inventory</span>
            <span className="text-base leading-none">›</span>
            <span>Stock Management</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Add Stock</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/inventory/dashboard/stock-management")}
          className="mt-1 flex items-center gap-1.5 font-nunito text-sm font-semibold text-[#622581] hover:text-[#52206d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Product Management
        </button>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white px-6 py-7 sm:px-8">
        <h2 className="font-poppins text-base font-semibold text-gray-900">Create Stock</h2>

        <form onSubmit={handleSubmit} className="mt-6">

          {/* ── Product ID — full width ── */}
          <div className="mb-5">
            <label className="font-nunito text-sm text-gray-800">
              Product ID
              <input
                placeholder="Enter Customer name"
                value={form.productId}
                onChange={(e) => set("productId", e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          {/* ── 2-column grid ── */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 lg:gap-x-16">

            <label className="font-nunito text-sm text-gray-800">
              Stock Name
              <input placeholder="Enter Gmail" value={form.stockName} onChange={(e) => set("stockName", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Stock Code
              <input placeholder="Enter Customer name" value={form.stockCode} onChange={(e) => set("stockCode", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Batch Number
              <input placeholder="Enter mobile number" value={form.batchNumber} onChange={(e) => set("batchNumber", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              UOM
              <input placeholder="Enter Pin-Code" value={form.uom} onChange={(e) => set("uom", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Quantity
              <input placeholder="Enter mobile number" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Manufactured Date
              <input placeholder="Enter Pin-Code" value={form.manufacturedDate} onChange={(e) => set("manufacturedDate", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Expired Date
              <input placeholder="Enter mobile number" value={form.expiredDate} onChange={(e) => set("expiredDate", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Stock Value
              <input placeholder="Enter Pin-Code" value={form.stockValue} onChange={(e) => set("stockValue", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Received Date
              <input placeholder="Enter mobile number" value={form.receivedDate} onChange={(e) => set("receivedDate", e.target.value)} className={inputClass} />
            </label>

            {/* Store — dropdown */}
            <label className="font-nunito text-sm text-gray-800">
              Store
              <div className={selectWrap}>
                <select value={form.store} onChange={(e) => set("store", e.target.value)} className={selectClass}>
                  <option value="" disabled>Select store</option>
                  {storeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Transportation Cost
              <input placeholder="Enter mobile number" value={form.transportCost} onChange={(e) => set("transportCost", e.target.value)} className={inputClass} />
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Payment Status
              <input placeholder="Enter Pin-Code" value={form.paymentStatus} onChange={(e) => set("paymentStatus", e.target.value)} className={inputClass} />
            </label>

            {/* Vendor — dropdown */}
            <label className="font-nunito text-sm text-gray-800">
              Vendor
              <div className={selectWrap}>
                <select value={form.vendor} onChange={(e) => set("vendor", e.target.value)} className={selectClass}>
                  <option value="" disabled>Select Vendor</option>
                  {vendorOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="font-nunito text-sm text-gray-800">
              Invoice Number
              <input placeholder="Enter Pin-Code" value={form.invoiceNumber} onChange={(e) => set("invoiceNumber", e.target.value)} className={inputClass} />
            </label>

            {/* CGST, IGST, SGST — 3 stacked inputs, left col */}
            <div className="font-nunito text-sm text-gray-800">
              CGST, IGST, SGST
              <input placeholder="Enter CGST" value={form.cgst} onChange={(e) => set("cgst", e.target.value)} className={inputClass} />
              <input placeholder="Enter IGST" value={form.igst} onChange={(e) => set("igst", e.target.value)} className={inputClass} />
              <input placeholder="Enter SGST" value={form.sgst} onChange={(e) => set("sgst", e.target.value)} className={inputClass} />
            </div>

            {/* Description — textarea, right col */}
            <label className="font-nunito text-sm text-gray-800">
              Description
              <textarea
                rows={5}
                placeholder="Enter description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition"
              />
            </label>
          </div>

          {/* ── Submit ── */}
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
