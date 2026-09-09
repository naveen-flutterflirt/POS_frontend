"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, Printer } from "lucide-react";

const invoiceItems = [
  { sno: "01", item: "Turmeric Powder", qty: "01", rate: "100", amount: "100.05" },
  { sno: "02", item: "Honey",           qty: "01", rate: "100", amount: "100.05" },
  { sno: "03", item: "Ghee",            qty: "01", rate: "100", amount: "100.05" },
];

const TOTAL_AMOUNT    = "₹300";
const RECEIVED_AMOUNT = "₹300";
const AMOUNT_IN_WORDS = "Three Hundred Rupees";

export default function POSBillingPrint() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">POS</h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Cashier</span>
            <span className="text-base leading-none">›</span>
            <span>POS</span>
            <span className="text-base leading-none">›</span>
            <span>Billing</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Print</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/cashier/dashboard/pos/billing")}
          className="mt-1 flex items-center gap-1.5 font-nunito text-sm font-semibold text-[#622581] hover:text-[#52206d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to POS
        </button>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">

        {/* ── Invoice preview ── */}
        <div className="border border-gray-200 bg-white font-nunito text-sm text-gray-800">

          {/* Header row */}
          <div className="grid grid-cols-2 border-b border-gray-200">
            {/* Left: owner */}
            <div className="border-r border-gray-200 px-5 py-4">
              <p className="font-poppins text-sm font-semibold">Owner Name or Organization</p>
              <p className="mt-1 text-xs text-gray-500">Mobile: 9999999999</p>
            </div>
            {/* Right: invoice meta */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="font-poppins text-sm font-semibold">Bill Of Supply</p>
                <p className="text-xs text-gray-500">13/12/2025</p>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Invoice No.</span>
                  <span>12345</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Invoice Date</span>
                  <span>13/12/2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="border-b border-gray-200 px-5 py-4">
            <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bill To</p>
            <p className="font-poppins text-sm font-medium text-gray-800">Narayana</p>
            <p className="mt-0.5 text-xs text-gray-500">Mobile: 9999999999</p>
          </div>

          {/* Items table */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {["S.No", "Items", "QTY", "Rate", "Amount"].map((h) => (
                  <th key={h} className="px-5 py-3 text-center font-nunito text-xs font-semibold text-gray-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoiceItems.map((row) => (
                <tr key={row.sno}>
                  <td className="px-5 py-3 text-center text-xs text-gray-700">{row.sno}</td>
                  <td className="px-5 py-3 text-center text-xs text-gray-700">{row.item}</td>
                  <td className="px-5 py-3 text-center text-xs text-gray-700">{row.qty}</td>
                  <td className="px-5 py-3 text-center text-xs text-gray-700">{row.rate}</td>
                  <td className="px-5 py-3 text-center text-xs text-gray-700">{row.amount}</td>
                </tr>
              ))}
              {/* Spacer rows to match design */}
              {Array.from({ length: 2 }).map((_, i) => (
                <tr key={`spacer-${i}`} className="h-8">
                  <td colSpan={5} />
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sub-total row */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 px-5 py-3">
            <span className="text-xs text-gray-500">S.No</span>
            <span className="text-xs font-semibold text-gray-800">₹300</span>
          </div>

          {/* Footer: Terms + Totals */}
          <div className="grid grid-cols-2 border-t border-gray-200">
            {/* Terms */}
            <div className="border-r border-gray-200 px-5 py-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                TERMS AND CONDITIONS
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600">
                <li>Goods once sold will not be taken back or exchanged</li>
                <li>All disputes are subject to Bangalore jurisdiction only</li>
              </ol>
            </div>
            {/* Totals */}
            <div className="px-5 py-4 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Total Amount</span>
                <span className="font-semibold">{TOTAL_AMOUNT}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Received Amount</span>
                <span className="font-semibold">{RECEIVED_AMOUNT}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Total Amount(In Words)</span>
                <span className="font-semibold text-right">{AMOUNT_IN_WORDS}</span>
              </div>
              {/* Signature */}
              <div className="mt-6 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
                Authorized Signature
              </div>
            </div>
          </div>
        </div>

        {/* ── Print panel ── */}
        <div className="border border-gray-200 bg-white px-5 py-5 font-nunito text-sm text-gray-700 space-y-5 h-fit">

          {/* Print header */}
          <div className="flex items-center justify-between">
            <span className="font-poppins text-sm font-semibold text-gray-800">Print</span>
            <span className="text-xs text-gray-500">1 Sheet of paper</span>
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">Destination</p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-8 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] cursor-pointer">
                <option>Microsoft Print to PDF</option>
                <option>Save as PDF</option>
              </select>
              <Printer className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Pages */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">Pages</p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] cursor-pointer">
                <option>Pages</option>
                <option>All</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">Color</p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] cursor-pointer">
                <option>Color</option>
                <option>Black &amp; White</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* More Settings */}
          <button
            type="button"
            className="flex w-full items-center justify-between border-t border-gray-100 pt-4 font-nunito text-sm text-gray-600 hover:text-gray-800"
          >
            <span>More Settings</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
