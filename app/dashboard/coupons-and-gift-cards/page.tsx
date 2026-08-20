"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Edit, Trash2, X } from "lucide-react";

type Coupon = {
  id: number;
  code: string;
  name: string;
  discountType: string;
  discountValue: string;
  minimumOrder: string;
  status: "Active" | "Inactive";
  startDate: string;
  endDate: string;
};

const initialCoupons: Coupon[] = [
  { id: 1, code: "SAVE10", name: "New User Offer", discountType: "Percentage", discountValue: "10%", minimumOrder: "₹500", status: "Active", startDate: "01/12/2026", endDate: "12/12/2026" },
  { id: 2, code: "SAVE10", name: "New User Offer", discountType: "Percentage", discountValue: "10%", minimumOrder: "₹500", status: "Active", startDate: "01/12/2026", endDate: "12/12/2026" },
  { id: 3, code: "SAVE10", name: "New User Offer", discountType: "Percentage", discountValue: "10%", minimumOrder: "₹500", status: "Active", startDate: "01/12/2026", endDate: "12/12/2026" },
];

export default function CouponsAndGiftCardsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [editFormData, setEditFormData] = useState<Coupon>(initialCoupons[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const handleEditClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditFormData(coupon);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCoupons((currentCoupons) => currentCoupons.map((coupon) => coupon.id === editFormData.id ? editFormData : coupon));
    setIsEditModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCoupon) return;
    setCoupons((currentCoupons) => currentCoupons.filter((coupon) => coupon.id !== selectedCoupon.id));
    setIsDeleteModalOpen(false);
    setSelectedCoupon(null);
  };

  const updateField = (field: keyof Coupon, value: string) => {
    setEditFormData((currentData) => ({ ...currentData, [field]: value } as Coupon));
  };

  return (
    <div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1>
          <div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500"><span>Admin</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Coupons and gift cards</span></div>
        </div>
        <div className="relative mt-1">
          <button type="button" onClick={() => setIsCreateMenuOpen((open) => !open)} className="flex items-center gap-3 rounded-lg bg-[#622581] px-5 py-2.5 text-sm font-nunito font-semibold text-white transition-colors hover:bg-[#52206d]" aria-expanded={isCreateMenuOpen}>
            <span>Create</span><span className="flex items-center gap-3 rounded border border-white/30 px-2 py-0.5 text-[9px] font-normal">Coupons<ChevronDown className="h-3 w-3" /></span>
          </button>
          {isCreateMenuOpen && <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"><Link href="/dashboard/coupons-and-gift-cards/create" className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#622581]/10">Coupons</Link><Link href="/dashboard/gift-cards" className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#622581]/10">Gift Cards</Link><Link href="/dashboard/personalized-offers/create" className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#622581]/10">Personalized Offers</Link></div>}
        </div>
      </div>

      <section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
        <div className="px-7 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Coupons details</h2></div>
        <div className="overflow-hidden text-[11px] font-normal leading-5 text-gray-800">
          <div className="grid h-11 grid-cols-[10%_13%_13%_13%_9%_11%_10%_10%_11%] items-center bg-[#f3f3f3] text-left"><div className="px-3 whitespace-nowrap">Coupon Code</div><div className="px-2.5 whitespace-nowrap">Coupon Name</div><div className="px-2.5 whitespace-nowrap">Discount Type</div><div className="px-2.5 whitespace-nowrap">Discount Value</div><div className="px-2.5 whitespace-nowrap">Min Order</div><div className="px-2.5 whitespace-nowrap">Status</div><div className="px-2.5 whitespace-nowrap">Start Date</div><div className="px-2.5 whitespace-nowrap">End Date</div><div className="px-2.5 text-center whitespace-nowrap">Actions</div></div>
          {coupons.map((coupon) => <div key={coupon.id} className="grid h-[52px] grid-cols-[10%_13%_13%_13%_9%_11%_10%_10%_11%] items-center border-b border-[#e2e6eb]"><div className="px-3 whitespace-nowrap">{coupon.code}</div><div className="px-2.5 whitespace-nowrap">{coupon.name}</div><div className="px-2.5 whitespace-nowrap">{coupon.discountType}</div><div className="px-2.5 whitespace-nowrap">{coupon.discountValue}</div><div className="px-2.5 whitespace-nowrap">{coupon.minimumOrder}</div><div className="px-2.5"><span className={`inline-flex rounded px-2 py-1 text-[10px] text-white ${coupon.status === "Active" ? "bg-[#55b566]" : "bg-[#e49a49]"}`}>{coupon.status}</span></div><div className="px-2.5 whitespace-nowrap">{coupon.startDate}</div><div className="px-2.5 whitespace-nowrap">{coupon.endDate}</div><div className="px-2.5"><div className="flex items-center justify-center gap-1"><button type="button" onClick={() => handleEditClick(coupon)} className="rounded p-1 text-[#1463ff] hover:bg-blue-50" aria-label={`Edit ${coupon.name}`}><Edit className="h-4 w-4" /></button><button type="button" onClick={() => { setSelectedCoupon(coupon); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label={`Delete ${coupon.name}`}><Trash2 className="h-4 w-4" /></button></div></div></div>)}
        </div>
      </section>

      {isEditModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-poppins font-medium text-gray-800">Edit Coupon</h2><button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close edit coupon modal"><X className="h-5 w-5" /></button></div><form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">{([["code", "Coupon Code"], ["name", "Coupon Name"], ["discountType", "Discount Type"], ["discountValue", "Discount Value"], ["minimumOrder", "Min Order"], ["status", "Status"], ["startDate", "Start Date"], ["endDate", "End Date"]] as [keyof Coupon, string][]).map(([field, label]) => <label key={field} className="text-sm font-normal text-gray-600">{label}<input required value={editFormData[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#622581]" /></label>)}<button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white md:col-span-2">Update</button></form></div></div>}
      {isDeleteModalOpen && selectedCoupon && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"><h2 className="text-xl font-poppins font-medium text-gray-800">Delete Coupon?</h2><p className="mt-2 text-sm text-gray-500">Are you sure you want to delete {selectedCoupon.name}?</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-600">Cancel</button><button type="button" onClick={handleDeleteConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white">Delete</button></div></div></div>}
    </div>
  );
}
