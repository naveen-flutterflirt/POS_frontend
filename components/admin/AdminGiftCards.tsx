"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

type GiftCard = {
  id: number;
  giftCardId: string;
  name: string;
  value: string;
  code: string;
  issuedTo: string;
  balance: string;
  status: "Active" | "Inactive";
  startDate: string;
  endDate: string;
};

const initialGiftCards: GiftCard[] = [
  { id: 1, giftCardId: "GC-001", name: "Festive Gift", value: "₹600", code: "1232345", issuedTo: "S.sara", balance: "₹300", status: "Active", startDate: "01/12/2026", endDate: "12/12/2026" },
  { id: 2, giftCardId: "GC-001", name: "Festive Gift", value: "₹600", code: "1232345", issuedTo: "S.sara", balance: "₹300", status: "Active", startDate: "01/12/2026", endDate: "12/12/2026" },
  { id: 3, giftCardId: "GC-001", name: "Festive Gift", value: "₹600", code: "1232345", issuedTo: "S.sara", balance: "₹300", status: "Active", startDate: "01/12/2026", endDate: "12/12/2026" },
];

export default function AdminGiftCards() {
  const [giftCards, setGiftCards] = useState(initialGiftCards);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [editFormData, setEditFormData] = useState<GiftCard>(initialGiftCards[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (card: GiftCard) => { setSelectedCard(card); setEditFormData(card); setIsEditModalOpen(true); };
  const handleEditSubmit = (event: React.FormEvent) => { event.preventDefault(); setGiftCards((cards) => cards.map((card) => card.id === editFormData.id ? editFormData : card)); setIsEditModalOpen(false); setSelectedCard(null); };
  const handleDelete = () => { if (!selectedCard) return; setGiftCards((cards) => cards.filter((card) => card.id !== selectedCard.id)); setIsDeleteModalOpen(false); setSelectedCard(null); };
  const updateField = (field: keyof GiftCard, value: string) => setEditFormData((data) => ({ ...data, [field]: value } as GiftCard));

  return (
    <div className="space-y-4 font-nunito">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500"><span>Admin</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Gift Cards</span></div>
        </div>
        <Link href="/admin/dashboard/gift-cards/create" className="mt-1 flex items-center gap-3 rounded-lg bg-[#622581] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#52206d]"><span>Create</span><span className="rounded border border-white/30 px-2 py-0.5 text-[9px]">Gift Card</span></Link>
      </div>

      <div className="bg-white">
        <div className="px-7 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Gift Cards Details</h2></div>
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="bg-[#f3f3f3] text-xs font-normal text-gray-800">
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Code</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Value</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Min Order</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Balance</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Issued To</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Expiry</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Transactions</th>
                <th className="whitespace-nowrap px-4 py-3 text-center font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {giftCards.map((card) => (
                <tr key={card.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.code}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.value}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">—</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.balance}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.issuedTo}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{card.endDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
                    <span className={`inline-flex rounded px-2 py-1 text-[10px] text-white ${card.status === "Active" ? "bg-[#55b566]" : "bg-[#e49a49]"}`}>{card.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">—</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      <button type="button" onClick={() => handleEdit(card)} className="rounded p-1 text-[#1463ff] hover:bg-blue-50" aria-label="Edit gift card"><Edit className="h-4 w-4" /></button>
                      <button type="button" onClick={() => { setSelectedCard(card); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label="Delete gift card"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6"><div className="mb-5 flex justify-between"><h2 className="text-xl font-poppins">Edit Gift Card</h2><button type="button" onClick={() => setIsEditModalOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button></div><form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">{([["giftCardId","Gift Card ID"],["name","Card Name"],["value","Card Value"],["code","Card Code"],["issuedTo","Issued To"],["balance","Balance"],["status","Status"],["startDate","Start Date"],["endDate","End Date"]] as [keyof GiftCard,string][]).map(([field,label]) => <label key={field} className="text-sm text-gray-600">{label}<input required value={editFormData[field]} onChange={(e) => updateField(field,e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}<button type="submit" className="col-span-1 rounded-lg bg-[#622581] py-2.5 text-white md:col-span-2">Update</button></form></div></div>}
      {isDeleteModalOpen && selectedCard && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="rounded-2xl bg-white p-6 text-center"><h2 className="text-xl font-poppins">Delete Gift Card?</h2><p className="my-4 text-sm text-gray-500">Are you sure you want to delete this gift card?</p><button type="button" onClick={() => setIsDeleteModalOpen(false)} className="mr-2 rounded-lg border px-4 py-2">Cancel</button><button type="button" onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white">Delete</button></div></div>}
    </div>
  );
}
