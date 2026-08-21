"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Plus } from "lucide-react";

export default function CreateStorePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    building: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pin: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Store Data:", formData);
  };

  const inputClassName = "mt-1.5 w-full rounded-lg border border-gray-300 px-2 py-2.5 text-sm font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20";

  return (
    <div className="scrollbar-none min-h-full min-w-0 space-y-6 overflow-x-hidden overflow-y-auto font-nunito">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">Store Management</h1>
          <div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500">
            <Link href="/admin/dashboard" className="transition-colors hover:text-[#622581]">Admin</Link>
            <span className="text-lg text-gray-400">›</span>
            <Link href="/admin/dashboard/store-management" className="transition-colors hover:text-[#622581]">Store Management</Link>
            <span className="text-lg text-gray-400">›</span>
            <span className="text-gray-800">Create Store</span>
          </div>
        </div>
        <Link href="/admin/dashboard/store-management" className="mt-1 flex items-center gap-2 whitespace-nowrap text-sm font-nunito text-[#622581] transition-colors hover:text-[#4d1d67]">
          <ArrowLeft className="h-4 w-4" />
          Back to Store Management
        </Link>
      </div>

      <section className="min-w-0 min-h-[calc(100vh-190px)] border border-gray-100 bg-white">
        <div className="flex min-h-[calc(100vh-190px)] flex-col px-8 py-7">
          <h2 className="text-base font-poppins font-medium text-gray-800">Create store</h2>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col">
            <div className="grid min-w-0 grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2 lg:gap-x-20 xl:gap-x-36">
              <label className="text-sm font-normal text-gray-800">Store Name<input required placeholder="Enter name" value={formData.name} onChange={(event) => updateField("name", event.target.value)} className={inputClassName} /></label>
              <label className="text-sm font-normal text-gray-800">Store Code<input required placeholder="Enter Code" value={formData.code} onChange={(event) => updateField("code", event.target.value)} className={inputClassName} /></label>
            </div>

            <h3 className="mt-4 text-base font-nunito font-normal text-gray-800 underline">Location Details</h3>
            <div className="grid min-w-0 grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2 lg:gap-x-20 xl:gap-x-36">
              <label className="text-sm font-normal text-gray-800">Building Name/No.<input required placeholder="Enter building Name/Number" value={formData.building} onChange={(event) => updateField("building", event.target.value)} className={inputClassName} /></label>
              <label className="text-sm font-normal text-gray-800">Street Name/No.<input required placeholder="Enter Street Name/Number" value={formData.street} onChange={(event) => updateField("street", event.target.value)} className={inputClassName} /></label>
              <label className="text-sm font-normal text-gray-800">City<input required placeholder="Enter City name" value={formData.city} onChange={(event) => updateField("city", event.target.value)} className={inputClassName} /></label>
              <label className="relative text-sm font-normal text-gray-800">State<select required value={formData.state} onChange={(event) => updateField("state", event.target.value)} className={`${inputClassName} appearance-none bg-white`}><option value="">Select State</option><option value="Karnataka">Karnataka</option><option value="Maharashtra">Maharashtra</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label>
              <label className="relative text-sm font-normal text-gray-800">Country<select required value={formData.country} onChange={(event) => updateField("country", event.target.value)} className={`${inputClassName} appearance-none bg-white`}><option value="">Select Country</option><option value="India">India</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-gray-400" /></label>
              <label className="text-sm font-normal text-gray-800">PIN<input required placeholder="Enter Pin" value={formData.pin} onChange={(event) => updateField("pin", event.target.value)} className={inputClassName} /></label>
            </div>

            <div className="mt-4">
              <span className="block text-sm font-normal text-gray-800">Image</span>
              <label className="relative mt-1.5 flex h-[125px] w-[125px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400 transition hover:border-[#622581]">
                {imagePreview ? <Image src={imagePreview} alt="Store preview" fill className="object-cover" /> : <><Plus className="h-5 w-5" /><span className="mt-2 text-xs">Add Image</span></>}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <div className="mt-auto flex justify-end pt-4">
              <button type="submit" className="min-w-[158px] rounded-lg bg-[#622581] px-8 py-2.5 font-poppins text-xl font-medium text-white transition-colors hover:bg-[#52206d]">Submit</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
