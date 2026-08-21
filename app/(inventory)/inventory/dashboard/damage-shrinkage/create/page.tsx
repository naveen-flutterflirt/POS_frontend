"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

const stockOptions    = ["Madhuvana Stock", "Stock A", "Stock B"];
const shrinkageTypes  = ["Damaged", "Expired"];

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition";

export default function AddShrinkagePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [stockName,      setStockName]      = useState("");
  const [shrinkageQty,   setShrinkageQty]   = useState("");
  const [auditedBy,      setAuditedBy]      = useState("M.RAM");
  const [approvedBy,     setApprovedBy]     = useState("M.RAM");
  const [pdfFile,        setPdfFile]        = useState<File | null>(null);
  const [shrinkageType,  setShrinkageType]  = useState("");
  const [isTypeOpen,     setIsTypeOpen]     = useState(false);
  const [description,    setDescription]    = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/inventory/dashboard/damage-shrinkage");
  };

  const selectType = (type: string) => {
    setShrinkageType(type);
    setIsTypeOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">
            Damage Shrinkage Management
          </h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Inventory</span>
            <span className="text-base leading-none">›</span>
            <span>damage shrinkage management</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Add Shrinkage</span>
          </div>
        </div>

        <button
          type="submit"
          form="shrinkage-form"
          className="rounded-lg bg-[#622581] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d] active:scale-95"
        >
          Add Shrinkage
        </button>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white px-6 py-7 sm:px-8">
        <h2 className="mb-6 font-poppins text-base font-semibold text-gray-900">Add Shrinkage</h2>

        <form id="shrinkage-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 lg:gap-x-16">

            {/* Stock Name — dropdown */}
            <div className="font-nunito text-sm text-gray-800">
              Stock Name
              <div className="relative mt-1.5">
                <select
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition cursor-pointer"
                >
                  <option value="" disabled>Choose Stock</option>
                  {stockOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Shrinkage Quantity */}
            <div className="font-nunito text-sm text-gray-800">
              Shrinkage Quantity
              <input
                placeholder="Enter Gmail"
                value={shrinkageQty}
                onChange={(e) => setShrinkageQty(e.target.value)}
                className={`mt-1.5 ${inputClass}`}
              />
            </div>

            {/* Audited By */}
            <div className="font-nunito text-sm text-gray-800">
              Audited By
              <input
                value={auditedBy}
                onChange={(e) => setAuditedBy(e.target.value)}
                className={`mt-1.5 ${inputClass}`}
              />
            </div>

            {/* Approved By */}
            <div className="font-nunito text-sm text-gray-800">
              Approved By
              <input
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                className={`mt-1.5 ${inputClass}`}
              />
            </div>

            {/* Upload PDF Copy — dashed dropzone */}
            <div className="font-nunito text-sm text-gray-800">
              Upload PDF Copy
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-1.5 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white py-10 transition hover:border-[#622581]/50 hover:bg-[#622581]/5"
                aria-label="Upload PDF file"
              >
                <Plus className="h-7 w-7 text-gray-400" />
                <span className="font-nunito text-sm text-gray-400">
                  {pdfFile ? pdfFile.name : "Add Image"}
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Shrinkage Type — custom dropdown with visible options */}
            <div className="font-nunito text-sm text-gray-800">
              Shrinkage Type
              <div className="relative mt-1.5">
                <button
                  type="button"
                  onClick={() => setIsTypeOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition"
                >
                  <span className={shrinkageType ? "text-gray-700" : ""}>
                    {shrinkageType || "Select Type"}
                  </span>
                  {isTypeOpen
                    ? <ChevronUp className="h-4 w-4 text-gray-400" />
                    : <ChevronDown className="h-4 w-4 text-gray-400" />
                  }
                </button>

                {isTypeOpen && (
                  <div className="mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-sm">
                    {/* Header row mirrors the trigger */}
                    <button
                      type="button"
                      onClick={() => setIsTypeOpen(false)}
                      className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-2.5 font-nunito text-sm text-gray-400 hover:bg-gray-50"
                    >
                      <span>{shrinkageType || "Select Type"}</span>
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    </button>
                    {shrinkageTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => selectType(type)}
                        className="w-full border-b border-gray-100 px-4 py-2.5 text-left font-nunito text-sm text-gray-700 last:border-0 hover:bg-[#622581]/5 hover:text-[#622581] transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description — textarea, left col */}
            <div className="font-nunito text-sm text-gray-800">
              Description
              <textarea
                rows={5}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition"
              />
            </div>
          </div>

          {/* Submit — bottom right */}
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
