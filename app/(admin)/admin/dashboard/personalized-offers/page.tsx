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
    <div className="space-y-4 font-nunito">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500"><span>Admin</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Personalized Offers</span></div>
        </div>
        <Link href="/admin/dashboard/personalized-offers/create" className="mt-1 rounded-lg bg-[#622581] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#52206d]">Add Personalized Offers</Link>
      </div>

      <div className="bg-white">
        <div className="px-7 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Gift Cards Details</h2></div>
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="bg-[#f3f3f3] text-xs font-normal text-gray-800">
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Offer Name</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Customer</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Discount Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Value</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Start Date</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">End Date</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Min Order</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Usage Limit</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-center font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{offer.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{offer.customer}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{offer.discountType}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{offer.type}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{offer.validity.split("-")[0]}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{offer.validity.split("-")[1]}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{offer.minimumBillAmount}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">—</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
                    <span className={`inline-flex rounded px-2 py-1 text-[9px] text-white ${offer.status === "Active" ? "bg-[#55b566]" : "bg-[#e49a49]"}`}>{offer.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => handleEdit(offer)} className="rounded p-1 text-[#1463ff] hover:bg-blue-50" aria-label="Edit personalized offer"><Edit className="h-4 w-4" /></button>
                      <button type="button" onClick={() => { setSelectedOffer(offer); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label="Delete personalized offer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6"><div className="mb-5 flex justify-between"><h2 className="text-xl font-poppins">Edit Personalized Offer</h2><button type="button" onClick={() => setIsEditModalOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button></div><form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">{([["offerId","Offer Id"],["name","Offer Name"],["type","Offer Type"],["customer","Customer"],["discountType","Discount Type"],["validity","Validity"],["minimumBillAmount","Min Bill Amount"],["status","Status"],["product","Product for free"]] as [keyof Offer,string][]).map(([field,label]) => <label key={field} className="text-sm text-gray-600">{label}<input required value={editFormData[field]} onChange={(e) => updateField(field,e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}<button type="submit" className="col-span-1 rounded-lg bg-[#622581] py-2.5 text-white md:col-span-2">Update</button></form></div></div>}
      {isDeleteModalOpen && selectedOffer && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="rounded-2xl bg-white p-6 text-center"><h2 className="text-xl font-poppins">Delete Personalized Offer?</h2><p className="my-4 text-sm text-gray-500">Are you sure you want to delete this offer?</p><button type="button" onClick={() => setIsDeleteModalOpen(false)} className="mr-2 rounded-lg border px-4 py-2">Cancel</button><button type="button" onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white">Delete</button></div></div>}
    </div>
  );
}
