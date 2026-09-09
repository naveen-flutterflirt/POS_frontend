"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ChevronLeft } from "lucide-react";

export default function CreateCashierCustomerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    pinCode: "",
    dateOfBirth: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Customer Data:", formData);
  };

  const inputClass = "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-sm font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20";

  return (
    <main className="h-screen max-h-screen overflow-hidden overscroll-none bg-gray-50 font-nunito text-[#111111]">
      <div className="flex h-full min-h-0 flex-col overflow-hidden px-5 py-6 sm:px-8 lg:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-poppins text-xl font-semibold text-gray-900 sm:text-2xl">Customer</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span>Cashier</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-900">Create Customer</span>
            </div>
          </div>
          <Link href="/admin/dashboard/cashier/customer" className="mt-1 flex items-center gap-2 whitespace-nowrap text-sm text-[#622581] hover:text-[#52206d]"><ChevronLeft className="h-4 w-4" />Back to Customer Management</Link>
        </div>

        <section className="relative mt-6 min-h-0 flex-1 overflow-hidden border border-gray-100 bg-white">
          <div className="flex h-full min-h-0 flex-col px-8 py-7">
            <h2 className="font-poppins text-base font-medium text-gray-900">Create Customer</h2>
            <form noValidate onSubmit={handleSubmit} className="mt-6 flex min-h-0 flex-1 flex-col">
              <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:gap-x-32">
                <label className="text-sm text-gray-800">Customer Name<input required placeholder="Enter Customer name" value={formData.name} onChange={(event) => updateField("name", event.target.value)} className={inputClass} /></label>
                <label className="text-sm text-gray-800">Email<input required type="email" placeholder="Enter Email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass} /></label>
                <label className="text-sm text-gray-800">Mobile Number<input required type="tel" placeholder="Enter mobile number" value={formData.mobile} onChange={(event) => updateField("mobile", event.target.value)} className={inputClass} /></label>
                <label className="text-sm text-gray-800">Pin-Code<input required placeholder="Enter Pin-Code" value={formData.pinCode} onChange={(event) => updateField("pinCode", event.target.value)} className={inputClass} /></label>
                <label className="relative text-sm text-gray-800">Date Of Birth<input required type="date" value={formData.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} className={`${inputClass} pr-9`} /><CalendarDays className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label>
              </div>
              <div className="absolute bottom-6 right-8"><button type="submit" className="min-w-[160px] rounded-xl bg-[#622581] px-8 py-2.5 font-poppins text-xl font-medium text-white transition-colors hover:bg-[#52206d]">Submit</button></div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
