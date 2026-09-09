"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SquarePen, Trash2, X, ChevronLeft } from "lucide-react";

type Record = {
  id: number;
  vendorBalance: string;
  date: string;
  name: string;
  creditBalance: string;
  debitBalance: string;
  debitLimits: string;
  creditLimits: string;
  totalPaymentReceived: string;
  paymentReceivedNo: string;
  utrNumber: string;
};

const initialRecords: Record[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  vendorBalance:        "₹38,200",
  date:                 "04/12/2025",
  name:                 "Sri Lakshmi",
  creditBalance:        "₹15,000",
  debitBalance:         "₹8,200",
  debitLimits:          "₹25,000",
  creditLimits:         "₹50,000",
  totalPaymentReceived: "₹1,20,000",
  paymentReceivedNo:    "PRN-5643",
  utrNumber:            "325698741523",
}));

const editFields: { field: keyof Omit<Record, "id">; label: string }[] = [
  { field: "vendorBalance",        label: "Vendor Balance" },
  { field: "date",                 label: "Date" },
  { field: "name",                 label: "Name" },
  { field: "creditBalance",        label: "Credit Balance" },
  { field: "debitBalance",         label: "Debit Balance" },
  { field: "debitLimits",          label: "Debit Limits" },
  { field: "creditLimits",         label: "Credit Limits" },
  { field: "totalPaymentReceived", label: "Total Payment Received" },
  { field: "paymentReceivedNo",    label: "Payment Received No." },
  { field: "utrNumber",            label: "UTR Number" },
];

export default function VendorPaymentRecordPage() {
  const router = useRouter();

  const [records, setRecords]           = useState<Record[]>(initialRecords);
  const [selected, setSelected]         = useState<Record | null>(null);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm]         = useState<Record>(initialRecords[0]);

  /* ── Edit ── */
  const openEdit = (row: Record) => { setEditForm(row); setSelected(row); setIsEditOpen(true); };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords((prev) => prev.map((r) => (r.id === editForm.id ? editForm : r)));
    setIsEditOpen(false);
    setSelected(null);
  };
  const updateField = (field: keyof Record, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  /* ── Delete ── */
  const openDelete = (row: Record) => { setSelected(row); setIsDeleteOpen(true); };
  const handleDeleteConfirm = () => {
    if (!selected) return;
    setRecords((prev) => prev.filter((r) => r.id !== selected.id));
    setIsDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">
            Vendor Management
          </h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Inventory</span>
            <span className="text-base leading-none">›</span>
            <span>Vendor management</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Vendor Payment Record</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/inventory/dashboard/vendor-management")}
          className="mt-1 flex items-center gap-1.5 font-nunito text-sm font-semibold text-[#622581] hover:text-[#52206d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Product Management
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="font-poppins text-base font-semibold text-gray-800">
            Vendor Payment Record
          </h2>
        </div>

        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {[
                  "Vendor Balance", "Date", "Name",
                  "Credit Balance", "Debit Balance",
                  "Debit Limits", "Credit Limits",
                  "Total Payment Recieved", "Payment Received No,",
                  "UTR Number", "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-4 py-3 text-left font-nunito text-sm font-normal text-gray-600 first:pl-6 last:pr-6"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 pl-6 font-nunito text-gray-700">{row.vendorBalance}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.creditBalance}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.debitBalance}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.debitLimits}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.creditLimits}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.totalPaymentReceived}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.paymentReceivedNo}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.utrNumber}</td>
                  <td className="whitespace-nowrap px-4 py-3 pr-6">
                    <span className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
                        aria-label={`Edit record ${row.utrNumber}`}
                      >
                        <SquarePen className="h-[18px] w-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(row)}
                        className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
                        aria-label={`Delete record ${row.utrNumber}`}
                      >
                        <Trash2 className="h-[18px] w-[18px]" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="scrollbar-none w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit Record</h2>
              <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {editFields.map(({ field, label }) => (
                <label key={field} className="font-nunito text-sm font-normal text-gray-600">
                  {label}
                  <input
                    required
                    value={editForm[field] as string}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                  />
                </label>
              ))}
              <button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d] md:col-span-2">
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {isDeleteOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="font-poppins text-xl font-medium text-gray-800">Delete Record?</h2>
            <p className="mt-2 font-nunito text-sm text-gray-500">
              Are you sure you want to delete the record for{" "}
              <span className="font-semibold text-gray-700">{selected.name}</span>?
              This cannot be undone.
            </p>
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
