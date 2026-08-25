"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function CreateGiftCardPage() {
  const router = useRouter();
  const { post } = useApi();
  const [formData, setFormData] = useState({ 
    cardName: "", 
    cardCode: "", 
    startDate: "", 
    endDate: "", 
    cardValue: "", 
    redemptionDetails: "", 
    issuedTo: "", 
    status: "" 
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await post("/marketing/gift-cards", formData);
      router.push("/admin/dashboard/coupons-and-gift-cards");
    } catch (error) {
      console.error("Failed to create gift card", error);
    }
  };

  const inputClassName = "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20";

  return (
    <div className="scrollbar-none min-h-full min-w-0 space-y-6 overflow-x-hidden overflow-y-auto font-nunito">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin/dashboard" className="hover:text-[#622581]">Admin</Link>
            <span className="text-lg text-gray-400">›</span>
            <span>Customer Management</span>
            <span className="text-lg text-gray-400">›</span>
            <span className="text-gray-800">Create Gift Card</span>
          </div>
        </div>
        <Link href="/admin/dashboard/gift-cards" className="mt-1 text-sm text-[#622581] hover:text-[#4d1d67]">Back to Gift Cards</Link>
      </div>

      <section className="min-h-[calc(100vh-190px)] border border-gray-100 bg-white">
        <div className="flex min-h-[calc(100vh-190px)] flex-col px-8 py-7">
          <h2 className="text-base font-poppins font-medium text-gray-800">Create Gift Card</h2>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col">
            <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2 lg:gap-x-20 xl:gap-x-36">
              <label className="text-sm font-normal text-gray-800">Card Name<input required placeholder="Enter program name" value={formData.cardName} onChange={(event) => updateField("cardName", event.target.value)} className={inputClassName} /></label>
              <label className="text-sm font-normal text-gray-800">Card Value<input required type="number" min="0" placeholder="Enter value" value={formData.cardValue} onChange={(event) => updateField("cardValue", event.target.value)} className={inputClassName} /></label>
              <div className="grid grid-cols-2 gap-6">
                <label className="relative text-sm font-normal text-gray-800">Start Date<input required type="date" value={formData.startDate} onChange={(event) => updateField("startDate", event.target.value)} className={`${inputClassName} pr-9`} /><CalendarDays className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label>
                <label className="relative text-sm font-normal text-gray-800">End Date<input required type="date" value={formData.endDate} onChange={(event) => updateField("endDate", event.target.value)} className={`${inputClassName} pr-9`} /><CalendarDays className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label>
              </div>
              <label className="text-sm font-normal text-gray-800">Issued To<input required placeholder="Enter customer name or email" value={formData.issuedTo} onChange={(event) => updateField("issuedTo", event.target.value)} className={inputClassName} /></label>
              <label className="text-sm font-normal text-gray-800">Redemption Details<input required placeholder="Enter redemption details..." value={formData.redemptionDetails} onChange={(event) => updateField("redemptionDetails", event.target.value)} className={inputClassName} /></label>
              <label className="relative text-sm font-normal text-gray-800">Status<select required value={formData.status} onChange={(event) => updateField("status", event.target.value)} className={`${inputClassName} appearance-none bg-white`}><option value="">Select Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label>
              <label className="text-sm font-normal text-gray-800">Card Code<input required placeholder="Enter card code" value={formData.cardCode} onChange={(event) => updateField("cardCode", event.target.value)} className={inputClassName} /></label>
            </div>
            <div className="mt-auto flex justify-end pt-6">
              <button type="submit" className="min-w-[128px] rounded-lg bg-[#622581] px-8 py-2.5 font-poppins text-xl font-medium text-white hover:bg-[#52206d]">Submit</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
