"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronDown, Plus, X, Percent, IndianRupee, SquarePen } from "lucide-react";

const customerOptions = ["M.Ram", "Sita", "Lakshman", "Githa", "Chandhana"];
const paymentMethods  = ["Cash", "UPI", "Card"] as const;
type PaymentMethod = (typeof paymentMethods)[number];

/* ── derived bill values (static for now) ── */
const SUB_TOTAL = 300;
const TAX       = 1.5;
const AMOUNT    = SUB_TOTAL + TAX;

export default function POSBilling() {
  const router = useRouter();

  /* payment */
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [receivedAmount, setReceivedAmount] = useState(String(AMOUNT));

  /* customer panel */
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerName, setCustomerName]     = useState("");

  /* discount modal */
  const [isDiscountOpen, setIsDiscountOpen]       = useState(false);
  const [discountTiming, setDiscountTiming]       = useState<"before" | "after">("after");
  const [discountPct, setDiscountPct]             = useState("");
  const [discountAmt, setDiscountAmt]             = useState("");

  /* additional charges modal */
  const [isChargesOpen, setIsChargesOpen]         = useState(false);
  const [chargesTiming, setChargesTiming]         = useState<"before" | "after">("after");
  const [charges, setCharges]                     = useState([{ label: "", price: "" }]);

  const addChargeLine = () => setCharges((prev) => [...prev, { label: "", price: "" }]);
  const updateCharge  = (i: number, field: "label" | "price", val: string) =>
    setCharges((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition";

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
            <span className="font-semibold text-gray-700">Billing</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/cashier/dashboard/pos")}
          className="mt-1 flex items-center gap-1.5 font-nunito text-sm font-semibold text-[#622581] hover:text-[#52206d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to POS
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="bg-white px-6 py-6 sm:px-8">
        <h2 className="font-poppins text-base font-semibold text-gray-900">Bill Details</h2>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-4">

            {/* Bill summary card */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 font-nunito text-sm font-semibold text-gray-700 border-b border-gray-200">
                Bill Details
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-5 py-3 font-nunito text-sm text-gray-600">
                  <span>Sub Total</span>
                  <span>₹{SUB_TOTAL}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3 font-nunito text-sm text-gray-600">
                  <span>Tax</span>
                  <span>₹ {TAX}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3 font-nunito text-sm font-semibold text-gray-800 bg-[#f0faf2]">
                  <span>Amount</span>
                  <span>₹ {AMOUNT}</span>
                </div>
              </div>
            </div>

            {/* Add Discount row */}
            <button
              type="button"
              onClick={() => setIsDiscountOpen(true)}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-3.5 font-nunito text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <span>Add Discount</span>
              <Plus className="h-4 w-4 text-gray-400" />
            </button>

            {/* Add Additional Charges row */}
            <button
              type="button"
              onClick={() => setIsChargesOpen(true)}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-3.5 font-nunito text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <span>Add Additional Charges</span>
              <Plus className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">

            {/* Received Amount card */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 font-nunito text-sm font-semibold text-gray-700 border-b border-gray-200">
                Received Amount
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <input
                  type="text"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                />
                {/* Payment method dropdown */}
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] cursor-pointer"
                  >
                    {paymentMethods.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Customer Details card */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 font-nunito text-sm font-semibold text-gray-700 border-b border-gray-200">
                Customer Detials
              </div>
              <div className="divide-y divide-gray-100">
                {/* Select Customer */}
                <div className="relative px-5 py-3">
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full appearance-none bg-transparent font-nunito text-sm text-gray-500 outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select Customer</option>
                    {customerOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                {/* Add Customer */}
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="flex w-full items-center justify-between px-5 py-3 font-nunito text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span>Add Customer</span>
                  <Plus className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom actions ── */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/cashier/dashboard/pos/billing/print")}
            className="rounded-lg border border-[#622581] bg-white px-6 py-2.5 font-poppins text-sm font-semibold text-[#622581] transition-colors hover:bg-[#622581]/5"
          >
            Save &amp; Print
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#622581] px-6 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d]"
          >
            Save Bill
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Customer Details Modal
      ══════════════════════════════════════════ */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-semibold text-gray-900">Customer Details</h2>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close customer details modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); setIsCustomerModalOpen(false); }}
              className="flex flex-col gap-4"
            >
              <label className="font-nunito text-sm text-gray-800">
                Mobile
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                />
              </label>
              <label className="font-nunito text-sm text-gray-800">
                Customer Name
                <input
                  type="text"
                  placeholder="Enter Customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-[#622581] py-3 font-poppins text-base font-semibold text-white transition-colors hover:bg-[#52206d]"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          Add Discount Modal
      ══════════════════════════════════════════ */}
      {isDiscountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-semibold text-gray-900">Add Discount</h2>
              <button
                type="button"
                onClick={() => setIsDiscountOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close discount modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Timing radio */}
            <div className="mb-5 flex items-center gap-8">
              {(["before", "after"] as const).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2 font-nunito text-sm text-gray-600 select-none">
                  <input
                    type="radio"
                    name="discountTiming"
                    value={t}
                    checked={discountTiming === t}
                    onChange={() => setDiscountTiming(t)}
                    className="h-4 w-4 accent-[#622581] cursor-pointer"
                  />
                  {t === "before" ? "Discount before tax" : "Discount After tax"}
                </label>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); setIsDiscountOpen(false); }}
              className="flex flex-col gap-4"
            >
              <label className="font-nunito text-sm text-gray-800">
                Percentage
                <div className="relative mt-1.5">
                  <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Percentage"
                    value={discountPct}
                    onChange={(e) => setDiscountPct(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 font-nunito text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                  />
                </div>
              </label>

              <label className="font-nunito text-sm text-gray-800">
                Amount
                <div className="relative mt-1.5">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    value={discountAmt}
                    onChange={(e) => setDiscountAmt(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 font-nunito text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-[#622581] py-3 font-poppins text-base font-semibold text-white transition-colors hover:bg-[#52206d]"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          Add Additional Charges Modal
      ══════════════════════════════════════════ */}
      {isChargesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-semibold text-gray-900">Add Additional Charge</h2>
              <button
                type="button"
                onClick={() => setIsChargesOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close charges modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Timing radio */}
            <div className="mb-5 flex items-center gap-8">
              {(["before", "after"] as const).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2 font-nunito text-sm text-gray-600 select-none">
                  <input
                    type="radio"
                    name="chargesTiming"
                    value={t}
                    checked={chargesTiming === t}
                    onChange={() => setChargesTiming(t)}
                    className="h-4 w-4 accent-[#622581] cursor-pointer"
                  />
                  {t === "before" ? "Discount before tax" : "Discount After tax"}
                </label>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); setIsChargesOpen(false); }}
              className="flex flex-col gap-4"
            >
              {charges.map((charge, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <label className="font-nunito text-sm text-gray-800">
                    Enter Chaarge
                    <input
                      type="text"
                      placeholder="Ex: Carry Bag"
                      value={charge.label}
                      onChange={(e) => updateCharge(i, "label", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                    />
                  </label>
                  <label className="font-nunito text-sm text-gray-800">
                    Price (₹)
                    <input
                      type="number"
                      placeholder="0"
                      value={charge.price}
                      onChange={(e) => updateCharge(i, "price", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                    />
                  </label>
                </div>
              ))}

              {/* Add another charge line */}
              <button
                type="button"
                onClick={addChargeLine}
                className="flex w-full items-center gap-2 rounded-lg border border-[#622581] px-4 py-2.5 font-nunito text-sm text-[#622581] transition-colors hover:bg-[#622581]/5"
              >
                <Plus className="h-4 w-4" />
                Add Additional Charge
              </button>

              <button
                type="submit"
                className="mt-1 w-full rounded-lg bg-[#622581] py-3 font-poppins text-base font-semibold text-white transition-colors hover:bg-[#52206d]"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
