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

export default function GiftCardsPage() {
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
    <div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
      <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1><div className="mt-1 flex items-center gap-2 text-sm text-gray-500"><span>Admin</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Gift Cards</span></div></div><Link href="/dashboard/gift-cards/create" className="mt-1 flex items-center gap-3 rounded-lg bg-[#622581] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#52206d]"><span>Create</span><span className="rounded border border-white/30 px-2 py-0.5 text-[9px]">Gift Card</span></Link></div>
      <section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white"><div className="px-7 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Gift Cards Details</h2></div><div className="overflow-hidden text-[11px] leading-5 text-gray-800"><div className="grid h-11 grid-cols-[11%_11%_10%_12%_10%_10%_10%_12%_12%_2%] items-center bg-[#f3f3f3]"><div className="px-2">Gift Card ID</div><div className="px-2">Card Name</div><div className="px-2">Card Value</div><div className="px-2">Card Code</div><div className="px-2">Issued To</div><div className="px-2">Balance</div><div className="px-2">Status</div><div className="px-2">Start Date</div><div className="px-2">End Date</div><div className="px-1 text-center">Actions</div></div>{giftCards.map((card) => <div key={card.id} className="grid h-[50px] grid-cols-[11%_11%_10%_12%_10%_10%_10%_12%_12%_2%] items-center border-b border-[#e2e6eb]"><div className="px-2">{card.giftCardId}</div><div className="px-2">{card.name}</div><div className="px-2">{card.value}</div><div className="px-2">{card.code}</div><div className="px-2">{card.issuedTo}</div><div className="px-2">{card.balance}</div><div className="px-2"><span className="rounded bg-[#55b566] px-2 py-1 text-[10px] text-white">{card.status}</span></div><div className="px-2">{card.startDate}</div><div className="px-2">{card.endDate}</div><div className="px-1"><div className="flex gap-1"><button type="button" onClick={() => handleEdit(card)} className="text-[#1463ff]" aria-label="Edit gift card"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => { setSelectedCard(card); setIsDeleteModalOpen(true); }} className="text-[#ff0000]" aria-label="Delete gift card"><Trash2 className="h-4 w-4" /></button></div></div></div>)}</div></section>
      {isEditModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6"><div className="mb-5 flex justify-between"><h2 className="text-xl font-poppins">Edit Gift Card</h2><button type="button" onClick={() => setIsEditModalOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button></div><form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">{([["giftCardId","Gift Card ID"],["name","Card Name"],["value","Card Value"],["code","Card Code"],["issuedTo","Issued To"],["balance","Balance"],["status","Status"],["startDate","Start Date"],["endDate","End Date"]] as [keyof GiftCard,string][]).map(([field,label]) => <label key={field} className="text-sm text-gray-600">{label}<input required value={editFormData[field]} onChange={(e) => updateField(field,e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}<button type="submit" className="col-span-2 rounded-lg bg-[#622581] py-2.5 text-white">Update</button></form></div></div>}
      {isDeleteModalOpen && selectedCard && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="rounded-2xl bg-white p-6 text-center"><h2 className="text-xl font-poppins">Delete Gift Card?</h2><p className="my-4 text-sm text-gray-500">Are you sure you want to delete this gift card?</p><button type="button" onClick={() => setIsDeleteModalOpen(false)} className="mr-2 rounded-lg border px-4 py-2">Cancel</button><button type="button" onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white">Delete</button></div></div>}
    </div>
  );
}
