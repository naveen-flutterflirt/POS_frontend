"use client";

import { useState } from "react";
import { SquarePen, Trash2, X } from "lucide-react";

type GRN = {
  id: number;
  grnNo: string;
  vendor: string;
  store: string;
  date: string;
  items: string;
  totalValue: string;
  status: "Received" | "Pending";
};

const initialGRNs: GRN[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  grnNo:      `GRN-00${i + 1}`,
  vendor:     "S. Neha",
  store:      "Madhuvana",
  date:       "12/12/2025",
  items:      "05",
  totalValue: "₹40,000",
  status:     "Received",
}));

export default function GRNPage() {
  const [grns, setGrns]                   = useState<GRN[]>(initialGRNs);
  const [selected, setSelected]           = useState<GRN | null>(null);
  const [isEditOpen, setIsEditOpen]       = useState(false);
  const [isDeleteOpen, setIsDeleteOpen]   = useState(false);
  const [editForm, setEditForm]           = useState<GRN>(initialGRNs[0]);

  const openEdit = (row: GRN) => { setEditForm(row); setSelected(row); setIsEditOpen(true); };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrns((prev) => prev.map((r) => (r.id === editForm.id ? editForm : r)));
    setIsEditOpen(false);
  };
  const updateField = (field: keyof GRN, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));
  const openDelete = (row: GRN) => { setSelected(row); setIsDeleteOpen(true); };
  const handleDeleteConfirm = () => {
    if (!selected) return;
    setGrns((prev) => prev.filter((r) => r.id !== selected.id));
    setIsDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">GRN</h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Inventory</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">GRN</span>
          </div>
        </div>
        <button type="button" className="rounded-lg bg-[#622581] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d]">
          Add GRN
        </button>
      </div>

      <div className="bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="font-poppins text-base font-semibold text-gray-800">GRN Details</h2>
        </div>
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {["GRN No.", "Vendor", "Store", "Date", "Items", "Total Value", "Status", "Actions"].map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3 text-left font-nunito text-sm font-normal text-gray-600 first:pl-6 last:pr-6">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grns.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 pl-6 font-nunito text-gray-700">{row.grnNo}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.vendor}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.store}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.items}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.totalValue}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`font-nunito text-sm font-medium ${row.status === "Received" ? "text-green-600" : "text-yellow-600"}`}>{row.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 pr-6">
                    <span className="inline-flex gap-3">
                      <button type="button" onClick={() => openEdit(row)} className="rounded p-1 text-[#1463ff] hover:bg-blue-50" aria-label={`Edit ${row.grnNo}`}><SquarePen className="h-[18px] w-[18px]" /></button>
                      <button type="button" onClick={() => openDelete(row)} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label={`Delete ${row.grnNo}`}><Trash2 className="h-[18px] w-[18px]" /></button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="scrollbar-none w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit GRN</h2>
              <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {(["grnNo","vendor","store","date","items","totalValue"] as (keyof GRN)[]).map((field) => (
                <label key={field} className="font-nunito text-sm text-gray-600 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                  <input required value={editForm[field] as string} onChange={(e) => updateField(field, e.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20" />
                </label>
              ))}
              <button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d] md:col-span-2">Update</button>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="font-poppins text-xl font-medium text-gray-800">Delete GRN?</h2>
            <p className="mt-2 font-nunito text-sm text-gray-500">Are you sure you want to delete <span className="font-semibold text-gray-700">{selected.grnNo}</span>?</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => setIsDeleteOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 font-nunito text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleDeleteConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 font-poppins text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
