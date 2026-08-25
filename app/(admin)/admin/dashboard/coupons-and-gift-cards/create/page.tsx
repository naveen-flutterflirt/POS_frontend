"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function CreateCouponPage() {
  const router = useRouter();
  const { post } = useApi();
  const [formData, setFormData] = useState({ couponName: "", couponCode: "", startDate: "", endDate: "", discountType: "", discountValue: "", minimumOrder: "", status: "" });
  const updateField = (field: keyof typeof formData, value: string) => setFormData((currentData) => ({ ...currentData, [field]: value }));
  const handleSubmit = async (event: React.FormEvent) => { 
    event.preventDefault(); 
    try {
      await post("/marketing/coupons", formData);
      router.push("/admin/dashboard/coupons-and-gift-cards");
    } catch (error) {
      console.error("Failed to create coupon", error);
    }
  };
  const inputClassName = "mt-1.5 w-full rounded-lg border border-gray-300 px-2 py-2.5 text-sm font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20";
  return (
    <div className="scrollbar-none min-h-full min-w-0 space-y-6 overflow-x-hidden overflow-y-auto font-nunito">
      <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1><div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500"><Link href="/admin/dashboard" className="hover:text-[#622581]">Admin</Link><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Coupons and gift cards</span></div></div><Link href="/admin/dashboard/coupons-and-gift-cards" className="mt-1 text-sm font-nunito text-[#622581] hover:text-[#4d1d67]">Back to Coupons</Link></div>
      <section className="min-w-0 min-h-[calc(100vh-190px)] border border-gray-100 bg-white"><div className="flex min-h-[calc(100vh-190px)] flex-col px-8 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Create Coupons and gift Cards</h2><form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col"><div className="grid min-w-0 grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2 lg:gap-x-20 xl:gap-x-36"><label className="text-sm font-normal text-gray-800">Coupon Name<input required placeholder="Enter program name" value={formData.couponName} onChange={(event) => updateField("couponName", event.target.value)} className={inputClassName} /></label>
<label className="text-sm font-normal text-gray-800">Coupon Code<input required placeholder="Enter code" value={formData.couponCode} onChange={(event) => updateField("couponCode", event.target.value)} className={inputClassName} /></label>
<div className="grid grid-cols-2 gap-6"><label className="relative text-sm font-normal text-gray-800">Start Date<input required type="date" value={formData.startDate} onChange={(event) => updateField("startDate", event.target.value)} className={`${inputClassName} pr-9`} /><CalendarDays className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label><label className="relative text-sm font-normal text-gray-800">End Date<input required type="date" value={formData.endDate} onChange={(event) => updateField("endDate", event.target.value)} className={`${inputClassName} pr-9`} /><CalendarDays className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label></div>
<label className="relative text-sm font-normal text-gray-800">Discount Type<select required value={formData.discountType} onChange={(event) => updateField("discountType", event.target.value)} className={`${inputClassName} appearance-none bg-white`}><option value="">Select Type</option><option value="Percentage">Percentage</option><option value="Fixed Amount">Fixed Amount</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label>
<label className="text-sm font-normal text-gray-800">Discount Value<input required type="number" min="0" placeholder="Enter discount value" value={formData.discountValue} onChange={(event) => updateField("discountValue", event.target.value)} className={inputClassName} /></label>
<label className="text-sm font-normal text-gray-800">Minimum Order<input required type="number" min="0" placeholder="Enter minimum order" value={formData.minimumOrder} onChange={(event) => updateField("minimumOrder", event.target.value)} className={inputClassName} /></label>
<label className="relative text-sm font-normal text-gray-800">Status<select required value={formData.status} onChange={(event) => updateField("status", event.target.value)} className={`${inputClassName} appearance-none bg-white`}><option value="">Select Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label></div><div className="mt-auto flex justify-end pt-6"><button type="submit" className="min-w-[128px] rounded-lg bg-[#622581] px-8 py-2.5 font-poppins text-xl font-medium text-white hover:bg-[#52206d]">Submit</button></div></form></div></section>
    </div>
  );
}
