"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ChevronDown, Edit, Trash2, X } from "lucide-react";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import { useApi } from "@/context/ApiContext";

type Coupon = {
  id: number;
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  minimumOrder: number;
  status: "Active" | "Inactive";
  startDate: string;
  endDate: string;
};

type GiftCard = {
  id: number;
  code: string;
  name: string;
  value: number;
  redemptionDetails: string;
  issuedTo: string;
  status: "Active" | "Inactive";
  startDate: string;
  endDate: string;
};

export default function AdminCouponsAndGiftCards() {
  const { del } = useApi();
  const { data: rawCoupons } = useCachedFetch<any[]>("/marketing/coupons", { cacheKey: "cache:marketing:coupons", staleTtl: 30_000 });
  const { data: rawGiftCards } = useCachedFetch<any[]>("/marketing/gift-cards", { cacheKey: "cache:marketing:gift-cards", staleTtl: 30_000 });

  const coupons = useMemo<Coupon[]>(() => rawCoupons?.map((c) => ({
    ...c,
    startDate: new Date(c.startDate).toLocaleDateString(),
    endDate: new Date(c.endDate).toLocaleDateString()
  })) || [], [rawCoupons]);

  const giftCards = useMemo<GiftCard[]>(() => rawGiftCards?.map((g) => ({
    ...g,
    startDate: new Date(g.startDate).toLocaleDateString(),
    endDate: new Date(g.endDate).toLocaleDateString()
  })) || [], [rawGiftCards]);

  const [activeTab, setActiveTab] = useState<"Coupons" | "GiftCards">("Coupons");
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const handleDeleteCoupon = async (id: number) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      await del(`/marketing/coupons/${id}`);
      window.location.reload();
    }
  };

  const handleDeleteGiftCard = async (id: number) => {
    if (confirm("Are you sure you want to delete this gift card?")) {
      await del(`/marketing/gift-cards/${id}`);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 font-nunito">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1>
          <div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500"><span>Admin</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Coupons and gift cards</span></div>
        </div>
        <div className="relative mt-1">
          <button type="button" onClick={() => setIsCreateMenuOpen((open) => !open)} className="flex items-center gap-3 rounded-lg bg-[#622581] px-5 py-2.5 text-sm font-nunito font-semibold text-white transition-colors hover:bg-[#52206d]">
            <span>Create</span><span className="flex items-center gap-3 rounded border border-white/30 px-2 py-0.5 text-[9px] font-normal">Coupons<ChevronDown className="h-3 w-3" /></span>
          </button>
          {isCreateMenuOpen && <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <Link href="/admin/dashboard/coupons-and-gift-cards/create" className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#622581]/10">Coupons</Link>
            <Link href="/admin/dashboard/gift-cards/create" className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#622581]/10">Gift Cards</Link>
          </div>}
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button onClick={() => setActiveTab("Coupons")} className={`py-2 px-4 font-poppins font-medium ${activeTab === "Coupons" ? "border-b-2 border-[#622581] text-[#622581]" : "text-gray-500"}`}>Coupons</button>
        <button onClick={() => setActiveTab("GiftCards")} className={`py-2 px-4 font-poppins font-medium ${activeTab === "GiftCards" ? "border-b-2 border-[#622581] text-[#622581]" : "text-gray-500"}`}>Gift Cards</button>
      </div>

      {activeTab === "Coupons" && (
        <div className="bg-white">
          <div className="px-7 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Coupons details</h2></div>
          <div className="scrollbar-none overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse font-nunito text-sm">
              <thead>
                <tr className="bg-[#f3f3f3] text-xs font-normal text-gray-800">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Coupon Name</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Code</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Discount Type</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Value</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Min Order</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Expiry</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Valid For</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-center font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{coupon.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{coupon.code}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{coupon.discountType}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{coupon.discountValue}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{coupon.minimumOrder}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{coupon.endDate}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{coupon.startDate}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
                      <span className={`inline-flex rounded px-2 py-1 text-[10px] text-white ${coupon.status === "Active" ? "bg-[#55b566]" : "bg-[#e49a49]"}`}>{coupon.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700 text-center">
                      <button type="button" onClick={() => handleDeleteCoupon(coupon.id)} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label={`Delete ${coupon.name}`}><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "GiftCards" && (
        <div className="bg-white">
          <div className="px-7 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Gift Cards details</h2></div>
          <div className="scrollbar-none overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse font-nunito text-sm">
              <thead>
                <tr className="bg-[#f3f3f3] text-xs font-normal text-gray-800">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Card Name</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Code</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Value</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Issued To</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Expiry</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-center font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {giftCards.map((card) => (
                  <tr key={card.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.code}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.value}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.issuedTo}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.endDate}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
                      <span className={`inline-flex rounded px-2 py-1 text-[10px] text-white ${card.status === "Active" ? "bg-[#55b566]" : "bg-[#e49a49]"}`}>{card.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700 text-center">
                      <button type="button" onClick={() => handleDeleteGiftCard(card.id)} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label={`Delete ${card.name}`}><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
