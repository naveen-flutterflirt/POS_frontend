"use client";

import { useState } from "react";
import { Edit, Star, Trash2, X } from "lucide-react";

type Purchase = {
  id: number;
  invoice: string;
  customer: string;
  phone: string;
  product: string;
  quantity: string;
  discount: string;
  cgst: string;
  sgst: string;
  paymentType: string;
  received: string;
  loyaltyPoints: string;
};

const initialPurchases: Purchase[] = [
  ["M.Ram", "10"],
  ["Sita", "10"],
  ["Lakshman", "10"],
  ["Githa", "10"],
  ["Chandhana", "10"],
].map(([customer, loyaltyPoints], index) => ({
  id: index + 1,
  invoice: "1233434",
  customer,
  phone: "9999999999",
  product: "Turmeric Powder",
  quantity: "01",
  discount: "10%",
  cgst: "2.5 %",
  sgst: "2.5 %",
  paymentType: "UPI",
  received: "1,450",
  loyaltyPoints,
}));

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [editFormData, setEditFormData] = useState<Purchase>(initialPurchases[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setEditFormData(purchase);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPurchases((currentPurchases) =>
      currentPurchases.map((purchase) =>
        purchase.id === editFormData.id ? editFormData : purchase,
      ),
    );
    setIsEditModalOpen(false);
    setSelectedPurchase(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedPurchase) return;
    setPurchases((currentPurchases) =>
      currentPurchases.filter((purchase) => purchase.id !== selectedPurchase.id),
    );
    setIsDeleteModalOpen(false);
    setSelectedPurchase(null);
  };

  const updateField = (field: keyof Purchase, value: string) => {
    setEditFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  return (
    <div className="space-y-4 font-nunito">
      <div>
        <h1 className="font-poppins text-xl font-medium text-gray-800 sm:text-2xl">Customer Management</h1>
        <div className="mt-1 flex items-center gap-2 font-nunito text-sm text-gray-500">
          <span>Admin</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Purchase History</span>
        </div>
      </div>

      <div className="bg-white">
        <div className="px-5 py-4 sm:px-7">
          <h2 className="font-poppins text-base font-medium text-gray-800">Purchase History</h2>
        </div>
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {["Invoice No.", "Customer", "Ph No", "Product", "Quantity", "Discount", "CGST", "SGST", "Payment Type", "Payment Received", "Loyalty Points", "Actions"].map((col) => (
                  <th key={col} className="whitespace-nowrap px-3 py-3 text-left font-nunito text-sm font-normal text-gray-600 first:pl-7 last:pr-7">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-3 pl-7 font-nunito text-gray-700">{purchase.invoice}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.customer}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.phone}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.product}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.quantity}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.discount}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.cgst}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.sgst}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.paymentType}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-nunito text-gray-700">{purchase.received}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className="flex items-center gap-1.5 font-nunito text-gray-700">
                      {purchase.loyaltyPoints}<Star className="h-4 w-4 fill-[#ffad00] text-[#ffad00]" />
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 pr-7">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleEditClick(purchase)} className="rounded p-1 text-[#1463ff] hover:bg-blue-50" aria-label={`Edit purchase for ${purchase.customer}`}><Edit className="h-[18px] w-[18px]" /></button>
                      <button type="button" onClick={() => { setSelectedPurchase(purchase); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label={`Delete purchase for ${purchase.customer}`}><Trash2 className="h-[18px] w-[18px]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-poppins font-medium text-gray-800">Edit Purchase</h2>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close edit purchase modal"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {([
                ["invoice", "Invoice No."], ["customer", "Customer"], ["phone", "Ph No"], ["product", "Product"], ["quantity", "Quantity"], ["discount", "Discount"], ["cgst", "CGST"], ["sgst", "SGST"], ["paymentType", "Payment Type"], ["received", "Payment Received"], ["loyaltyPoints", "Loyalty Points"],
              ] as [keyof Purchase, string][]).map(([field, label]) => (
                <label key={field} className="text-sm font-normal text-gray-600">{label}<input required value={editFormData[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20" /></label>
              ))}
              <button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d] md:col-span-2">Update</button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="text-xl font-poppins font-medium text-gray-800">Delete Purchase?</h2>
            <p className="mt-2 text-sm font-normal text-gray-500">Are you sure you want to delete {selectedPurchase.customer}&apos;s purchase?</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-normal text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleDeleteConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
