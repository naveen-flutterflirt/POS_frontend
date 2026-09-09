"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronDown, Plus, Upload } from "lucide-react";

const vendorNameOptions = ["Narayana", "Vendor A", "Vendor B"];
const vendorTypeOptions  = ["Wholesaler", "Retailer", "Distributor"];
const paymentTypes       = ["UPI", "Cash", "Card"] as const;
type PaymentType = (typeof paymentTypes)[number];

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition";

export default function AddVendorPage() {
  const router = useRouter();

  const kycRef1  = useRef<HTMLInputElement>(null);
  const kycRef2  = useRef<HTMLInputElement>(null);
  const pdfRef   = useRef<HTMLInputElement>(null);

  const [vendorName,    setVendorName]    = useState("");
  const [vendorCode,    setVendorCode]    = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorGst,     setVendorGst]     = useState("");
  const [kycFile1,      setKycFile1]      = useState<File | null>(null);
  const [kycFile2,      setKycFile2]      = useState<File | null>(null);
  const [vehicleNo,     setVehicleNo]     = useState("");
  const [esugamNo,      setEsugamNo]      = useState("");
  const [pdfFile,       setPdfFile]       = useState<File | null>(null);
  const [vendorType,    setVendorType]    = useState("");
  const [paymentType,   setPaymentType]   = useState<PaymentType | "">("");

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
            <span className="font-semibold text-gray-700">Add vendor</span>
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
        <h2 className="mb-6 font-poppins text-base font-semibold text-gray-900">Add Vendor</h2>

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
                  {vendorNameOptions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Vendor Code */}
            <div className="font-nunito text-sm text-gray-800">
              Vendor Code
              <input
                placeholder="Enter Gmail"
                value={vendorCode}
                onChange={(e) => setVendorCode(e.target.value)}
                className={`mt-1.5 ${inputClass}`}
              />
            </div>

            {/* Vendor Address */}
            <div className="font-nunito text-sm text-gray-800">
              Vendor Address
              <input
                placeholder="Enter mobile number"
                value={vendorAddress}
                onChange={(e) => setVendorAddress(e.target.value)}
                className={`mt-1.5 ${inputClass}`}
              />
            </div>

            {/* Vendor GST */}
            <div className="font-nunito text-sm text-gray-800">
              Vendor GST
              <input
                placeholder="Enter Pin-Code"
                value={vendorGst}
                onChange={(e) => setVendorGst(e.target.value)}
                className={`mt-1.5 ${inputClass}`}
              />
            </div>

            {/* Vendor KYC Documents — two dashed dropzones stacked */}
            <div className="font-nunito text-sm text-gray-800">
              Vendor KYC Documents (Aadhar, PAN)
              <div className="mt-1.5 flex flex-col gap-3">
                {/* Dropzone 1 */}
                <button
                  type="button"
                  onClick={() => kycRef1.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white py-6 transition hover:border-[#622581]/50 hover:bg-[#622581]/5"
                  aria-label="Upload Aadhar"
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                  <span className="font-nunito text-sm text-gray-400">
                    {kycFile1 ? kycFile1.name : "Add Image"}
                  </span>
                </button>
                <input ref={kycRef1} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={(e) => setKycFile1(e.target.files?.[0] ?? null)} />

                {/* Dropzone 2 */}
                <button
                  type="button"
                  onClick={() => kycRef2.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white py-6 transition hover:border-[#622581]/50 hover:bg-[#622581]/5"
                  aria-label="Upload PAN"
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                  <span className="font-nunito text-sm text-gray-400">
                    {kycFile2 ? kycFile2.name : "Add Image"}
                  </span>
                </button>
                <input ref={kycRef2} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={(e) => setKycFile2(e.target.files?.[0] ?? null)} />
              </div>
            </div>

            {/* Account Details — Vehicle No, ESUGAM No, Upload PDF Copy */}
            <div className="font-nunito text-sm text-gray-800">
              Account Details
              <div className="mt-1.5 flex flex-col gap-3">
                <input
                  placeholder="Vehicle Number"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="esugam Number"
                  value={esugamNo}
                  onChange={(e) => setEsugamNo(e.target.value)}
                  className={inputClass}
                />
                {/* Upload PDF — input-styled button */}
                <button
                  type="button"
                  onClick={() => pdfRef.current?.click()}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-400 outline-none hover:border-[#622581]/50 transition text-left"
                >
                  <span>{pdfFile ? pdfFile.name : "Upload PDF Copy"}</span>
                  <Upload className="h-4 w-4 text-gray-400" />
                </button>
                <input ref={pdfRef} type="file" accept=".pdf" className="hidden"
                  onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>

            {/* Vendor Type — dropdown */}
            <div className="font-nunito text-sm text-gray-800">
              Vendor Type
              <div className="relative mt-1.5">
                <select
                  value={vendorType}
                  onChange={(e) => setVendorType(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-nunito text-sm text-gray-400 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 transition cursor-pointer"
                >
                  <option value="" disabled>Select Type</option>
                  {vendorTypeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
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
