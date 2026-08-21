"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

type Offer = {
  id: number;
  offerId: string;
  name: string;
  type: string;
  customer: string;
  discountType: string;
  validity: string;
  minimumBillAmount: string;
  status: "Active" | "Inactive";
  product: string;
};

const initialOffers: Offer[] = [
  { id: 1, offerId: "00001", name: "Birth day Offer", type: "Cashback", customer: "S.sara", discountType: "Percentage", validity: "12/03/2025-12/04/2025", minimumBillAmount: "₹1000", status: "Active", product: "-" },
  { id: 2, offerId: "00001", name: "Birth day Offer", type: "Cashback", customer: "S.sara", discountType: "Percentage", validity: "12/03/2025-12/04/2025", minimumBillAmount: "₹1000", status: "Active", product: "-" },
  { id: 3, offerId: "00001", name: "Birth day Offer", type: "Cashback", customer: "S.sara", discountType: "Percentage", validity: "12/03/2025-12/04/2025", minimumBillAmount: "₹1000", status: "Active", product: "-" },
];

export default function PersonalizedOffersPage() {
  const [offers, setOffers] = useState(initialOffers);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [editFormData, setEditFormData] = useState<Offer>(initialOffers[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (offer: Offer) => { setSelectedOffer(offer); setEditFormData(offer); setIsEditModalOpen(true); };
  const handleEditSubmit = (event: React.FormEvent) => { event.preventDefault(); setOffers((currentOffers) => currentOffers.map((offer) => offer.id === editFormData.id ? editFormData : offer)); setIsEditModalOpen(false); setSelectedOffer(null); };
  const handleDelete = () => { if (!selectedOffer) return; setOffers((currentOffers) => currentOffers.filter((offer) => offer.id !== selectedOffer.id)); setIsDeleteModalOpen(false); setSelectedOffer(null); };
  const updateField = (field: keyof Offer, value: string) => setEditFormData((data) => ({ ...data, [field]: value } as Offer));

  return (
    <div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
      <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1><div className="mt-1 flex items-center gap-2 text-sm text-gray-500"><span>Admin</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Personalized Offers</span></div></div><Link href="/admin/dashboard/personalized-offers/create" className="mt-1 rounded-lg bg-[#622581] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#52206d]">Add Personalized Offers</Link></div>
      <section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white"><div className="px-7 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Gift Cards Details</h2></div><div className="overflow-hidden text-[10px] leading-4 text-gray-800"><div className="grid h-11 grid-cols-[8%_10%_9%_9%_10%_10%_12%_10%_11%_11%] items-center bg-[#f3f3f3]"><div className="px-1">Offer Id</div><div className="px-1">Offer Name</div><div className="px-1">Offer Type</div><div className="px-1">Customer</div><div className="px-1">Discount Type</div><div className="px-1">Validity</div><div className="px-1">Min Bill Amount</div><div className="px-1">Status</div><div className="px-1">Product for free</div><div className="px-1 text-center">Actions</div></div>{offers.map((offer) => <div key={offer.id} className="grid h-[50px] grid-cols-[8%_10%_9%_9%_10%_10%_12%_10%_11%_11%] items-center border-b border-[#e2e6eb]"><div className="px-1">{offer.offerId}</div><div className="px-1">{offer.name}</div><div className="px-1">{offer.type}</div><div className="px-1">{offer.customer}</div><div className="px-1">{offer.discountType}</div><div className="px-1 whitespace-pre-line">{offer.validity.replace("-", "-\n")}</div><div className="px-1">{offer.minimumBillAmount}</div><div className="px-1"><span className="rounded bg-[#55b566] px-2 py-1 text-[9px] text-white">{offer.status}</span></div><div className="px-1">{offer.product}</div><div className="px-1"><div className="flex justify-center gap-2"><button type="button" onClick={() => handleEdit(offer)} className="text-[#1463ff]" aria-label="Edit personalized offer"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => { setSelectedOffer(offer); setIsDeleteModalOpen(true); }} className="text-[#ff0000]" aria-label="Delete personalized offer"><Trash2 className="h-4 w-4" /></button></div></div></div>)}</div></section>
      {isEditModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6"><div className="mb-5 flex justify-between"><h2 className="text-xl font-poppins">Edit Personalized Offer</h2><button type="button" onClick={() => setIsEditModalOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button></div><form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">{([["offerId","Offer Id"],["name","Offer Name"],["type","Offer Type"],["customer","Customer"],["discountType","Discount Type"],["validity","Validity"],["minimumBillAmount","Min Bill Amount"],["status","Status"],["product","Product for free"]] as [keyof Offer,string][]).map(([field,label]) => <label key={field} className="text-sm text-gray-600">{label}<input required value={editFormData[field]} onChange={(e) => updateField(field,e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}<button type="submit" className="col-span-2 rounded-lg bg-[#622581] py-2.5 text-white">Update</button></form></div></div>}
      {isDeleteModalOpen && selectedOffer && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="rounded-2xl bg-white p-6 text-center"><h2 className="text-xl font-poppins">Delete Personalized Offer?</h2><p className="my-4 text-sm text-gray-500">Are you sure you want to delete this offer?</p><button type="button" onClick={() => setIsDeleteModalOpen(false)} className="mr-2 rounded-lg border px-4 py-2">Cancel</button><button type="button" onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white">Delete</button></div></div>}
    </div>
  );
}
