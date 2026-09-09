"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SquarePen, Trash2, Download, X, ChevronLeft } from "lucide-react";

type Vendor = {
  id: number;
  vendorName: string;
  code: string;
  address: string;
  gst: string;
  vehicleNo: string;
  esugamNo: string;
  vendorType: string;
  paymentType: string;
};

const initialVendors: Vendor[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  vendorName:  "Narayana",
  code:        "01",
  address:     "Lorem ipsum dolor sit amet consectetur.",
  gst:         "54895487954",
  vehicleNo:   "xxxxxxxxxx",
  esugamNo:    "xxxxxxxxxx",
  vendorType:  "Vendor Type",
  paymentType: "UPI",
}));

const editFields: { field: keyof Omit<Vendor, "id">; label: string }[] = [
  { field: "vendorName",   label: "Vendor Name" },
  { field: "code",         label: "Code" },
  { field: "address",      label: "Address" },
  { field: "gst",          label: "GST" },
  { field: "vehicleNo",    label: "Vehicle No." },
  { field: "esugamNo",     label: "ESUGAM No." },
  { field: "vendorType",   label: "Vendor Type" },
  { field: "paymentType",  label: "Payment Type" },
];

/* Reusable PDF-badge cell */
function PdfBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 font-nunito text-xs text-gray-600">
        {label}
      </span>
      <button type="button" aria-label={`Download ${label}`} className="text-gray-500 hover:text-gray-700 transition-colors">
        <Download className="h-4 w-4" />
      </button>
    </span>
  );
}

export default function InventoryVendorManagement() {
  const router = useRouter();

  const [vendors, setVendors]           = useState<Vendor[]>(initialVendors);
  const [selected, setSelected]         = useState<Vendor | null>(null);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm]         = useState<Vendor>(initialVendors[0]);

  /* ── Edit ── */
  const openEdit = (row: Vendor) => { setEditForm(row); setSelected(row); setIsEditOpen(true); };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVendors((prev) => prev.map((v) => (v.id === editForm.id ? editForm : v)));
    setIsEditOpen(false);
    setSelected(null);
  };
  const updateField = (field: keyof Vendor, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  /* ── Delete ── */
  const openDelete = (row: Vendor) => { setSelected(row); setIsDeleteOpen(true); };
  const handleDeleteConfirm = () => {
    if (!selected) return;
    setVendors((prev) => prev.filter((v) => v.id !== selected.id));
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
            <span className="font-semibold text-gray-700">Vendor management</span>
            <span className="text-base leading-none">›</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/inventory/dashboard/vendor-management/record")}
            className="rounded-lg border border-[#622581] bg-white px-5 py-2.5 font-poppins text-sm font-semibold text-[#622581] transition-colors hover:bg-[#622581]/5"
          >
            Payment Record
          </button>
          <button
            type="button"
            onClick={() => router.push("/inventory/dashboard/vendor-management/payment")}
            className="rounded-lg border border-[#622581] bg-white px-5 py-2.5 font-poppins text-sm font-semibold text-[#622581] transition-colors hover:bg-[#622581]/5"
          >
            Payment Details
          </button>
          <button
            type="button"
            onClick={() => router.push("/inventory/dashboard/vendor-management/create")}
            className="rounded-lg bg-[#622581] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d] active:scale-95"
          >
            Add Vendor
          </button>
          <button
            type="button"
            onClick={() => router.push("/inventory/dashboard")}
            className="flex items-center gap-1.5 font-nunito text-sm font-semibold text-[#622581] hover:text-[#52206d] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Product Management
          </button>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="font-poppins text-base font-semibold text-gray-800">Add Vendor</h2>
        </div>

        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {[
                  "Vendor Name", "Code", "Address", "GST",
                  "KYC", "Vehicle No.", "ESUGAM No.", "PDF",
                  "Vendor Type", "Payement Type", "Actions",
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
              {vendors.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 pl-6 font-nunito text-gray-700">{row.vendorName}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.code}</td>
                  {/* Address wraps to two lines */}
                  <td className="px-4 py-3 font-nunito text-sm text-gray-700 max-w-[160px] leading-snug">{row.address}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.gst}</td>
                  {/* KYC — DOC.PDF badge */}
                  <td className="whitespace-nowrap px-4 py-3">
                    <PdfBadge label="DOC.PDF" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.vehicleNo}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.esugamNo}</td>
                  {/* PDF — Copy.PDF badge */}
                  <td className="whitespace-nowrap px-4 py-3">
                    <PdfBadge label="Copy.PDF" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.vendorType}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.paymentType}</td>
                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-3 pr-6">
                    <span className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
                        aria-label={`Edit ${row.vendorName}`}
                      >
                        <SquarePen className="h-[18px] w-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(row)}
                        className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
                        aria-label={`Delete ${row.vendorName}`}
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
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit Vendor</h2>
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
            <h2 className="font-poppins text-xl font-medium text-gray-800">Delete Vendor?</h2>
            <p className="mt-2 font-nunito text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">{selected.vendorName}</span>?
              This action cannot be undone.
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
