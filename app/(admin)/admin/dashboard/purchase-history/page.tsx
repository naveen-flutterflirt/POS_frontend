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
    <div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
      <div>
        <h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1>
        <div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500">
          <span>Admin</span>
          <span className="text-lg text-gray-400">›</span>
          <span>Customer Management</span>
          <span className="text-lg text-gray-400">›</span>
          <span className="text-gray-800">Purchase History</span>
        </div>
      </div>

      <section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
        <div className="px-7 py-7">
          <h2 className="text-base font-poppins font-medium text-gray-800">Purchase History</h2>
        </div>

        <div className="overflow-hidden text-xs font-normal text-gray-800">
          <div className="grid h-12 grid-cols-[10%_10%_10%_10%_6%_7%_6%_6%_10%_12%_8%_5%] items-center bg-[#f3f3f3] text-left">
            <div className="px-2 whitespace-nowrap">Invoice No.</div>
            <div className="px-2 whitespace-nowrap">Customer</div>
            <div className="px-2 whitespace-nowrap">Ph No</div>
            <div className="px-2 whitespace-nowrap">Product</div>
            <div className="px-2 whitespace-nowrap">Quantity</div>
            <div className="px-2 whitespace-nowrap">Discount</div>
            <div className="px-2 whitespace-nowrap">CGST</div>
            <div className="px-2 whitespace-nowrap">SGST</div>
            <div className="px-2 whitespace-nowrap">Payment Type</div>
            <div className="px-2 whitespace-nowrap">Payment Received</div>
            <div className="px-2 leading-4">Loyalty<br />Points</div>
            <div className="px-2 whitespace-nowrap text-center">Actions</div>
          </div>

          {purchases.map((purchase) => (
            <div key={purchase.id} className="grid h-[57px] grid-cols-[10%_10%_10%_10%_6%_7%_6%_6%_10%_12%_8%_5%] items-center border-b border-[#e2e6eb]">
              <div className="px-2 whitespace-nowrap">{purchase.invoice}</div>
              <div className="px-2 whitespace-nowrap">{purchase.customer}</div>
              <div className="px-2 whitespace-nowrap">{purchase.phone}</div>
              <div className="px-2 whitespace-nowrap">{purchase.product}</div>
              <div className="px-2 whitespace-nowrap">{purchase.quantity}</div>
              <div className="px-2 whitespace-nowrap">{purchase.discount}</div>
              <div className="px-2 whitespace-nowrap">{purchase.cgst}</div>
              <div className="px-2 whitespace-nowrap">{purchase.sgst}</div>
              <div className="px-2 whitespace-nowrap">{purchase.paymentType}</div>
              <div className="px-2 whitespace-nowrap">{purchase.received}</div>
              <div className="flex items-center gap-2 px-2 whitespace-nowrap">
                {purchase.loyaltyPoints}
                <Star className="h-4 w-4 fill-[#ffad00] text-[#ffad00]" />
              </div>
              <div className="px-2">
                <div className="flex items-center justify-center gap-2">
                  <button type="button" onClick={() => handleEditClick(purchase)} className="rounded p-1 text-[#1463ff] hover:bg-blue-50" aria-label={`Edit purchase for ${purchase.customer}`}>
                    <Edit className="h-[18px] w-[18px]" />
                  </button>
                  <button type="button" onClick={() => { setSelectedPurchase(purchase); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label={`Delete purchase for ${purchase.customer}`}>
                    <Trash2 className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
