"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SquarePen, Trash2, Download, X } from "lucide-react";

type Shrinkage = {
  id: number;
  stockName: string;
  qty: string;
  mnfDate: string;
  expDate: string;
  receivedDate: string;
  stockValue: string;
  auditedBy: string;
  approvedBy: string;
  shrinkageType: string;
  description: string;
};

const initialData: Shrinkage[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  stockName: "Madhuvana",
  qty: "01",
  mnfDate: "01/03/2025",
  expDate: "12/12/2026",
  receivedDate: "12/12/2025",
  stockValue: "₹40,000",
  auditedBy: "M. Madhavan",
  approvedBy: "M. Ram",
  shrinkageType: "Shrinkage Type",
  description: "Description",
}));

const editFields: { field: keyof Omit<Shrinkage, "id">; label: string }[] = [
  { field: "stockName", label: "Stock Name" },
  { field: "qty", label: "Quantity" },
  { field: "mnfDate", label: "Mnf Date" },
  { field: "expDate", label: "Exp Date" },
  { field: "receivedDate", label: "Received Date" },
  { field: "stockValue", label: "Stock Value" },
  { field: "auditedBy", label: "Audited By" },
  { field: "approvedBy", label: "Approved By" },
  { field: "shrinkageType", label: "Shrinkage Type" },
  { field: "description", label: "Description" },
];

export default function InventoryDamageShrinkage() {
  const router = useRouter();

  const [rows, setRows] = useState<Shrinkage[]>([]);
  const [selected, setSelected] = useState<Shrinkage | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState<Shrinkage>({} as Shrinkage);

  // Load shrinkage/damage logs on mount
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/inventory/stores/STORE_DEFAULT/ledger`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter ledger logs that are damages/shrinkages
          const shrinkages = data.filter((item: any) =>
            item.movementType === "DAMAGE" || item.movementType === "SHRINKAGE" || item.movementType === "ADJUSTMENT"
          );
          const mapped: Shrinkage[] = shrinkages.map((item: any) => ({
            id: item.id,
            stockName: item.sku?.product?.name || "Product SKU",
            qty: String(item.qtyDelta || item.quantity),
            mnfDate: "",
            expDate: "",
            receivedDate: item.occurredAt ? new Date(item.occurredAt).toLocaleDateString() : "",
            stockValue: String(Number(item.unitCost) * (Number(item.qtyDelta || item.quantity) || 1)),
            auditedBy: item.auditedBy || "Auditor",
            approvedBy: item.approvedBy || "Manager",
            shrinkageType: item.shrinkageType || item.movementType,
            description: item.metadata || "",
          }));
          setRows(mapped);
        }
      })
      .catch(console.error);
  }, []);

  /* ── Edit ── */
  const openEdit = (row: Shrinkage) => { setEditForm(row); setSelected(row); setIsEditOpen(true); };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRows((prev) => prev.map((r) => (r.id === editForm.id ? editForm : r)));
    setIsEditOpen(false);
    setSelected(null);
  };
  const updateField = (field: keyof Shrinkage, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  /* ── Delete ── */
  const openDelete = (row: Shrinkage) => { setSelected(row); setIsDeleteOpen(true); };
  const handleDeleteConfirm = () => {
    if (!selected) return;
    setRows((prev) => prev.filter((r) => r.id !== selected.id));
    setIsDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">
            Damage Shrinkage Management
          </h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Inventory</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">damage shrinkage management</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/inventory/dashboard/damage-shrinkage/create")}
          className="rounded-lg bg-[#622581] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d] active:scale-95"
        >
          Add Shrinkage
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="font-poppins text-base font-semibold text-gray-800">Shrinkage Details</h2>
        </div>

        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {[
                  "Stock Name", "Qnty", "mnf Date", "exp Date",
                  "Received Date", "Stock Value", "Audited By",
                  "Approved By", "Pdf Copy", "Shrinkage Type", "Description", "Actions",
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
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 pl-6 font-nunito text-gray-700">{row.stockName}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.qty}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.mnfDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.expDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.receivedDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.stockValue}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.auditedBy}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.approvedBy}</td>

                  {/* Pdf Copy — "Copy.PDF" badge + download icon */}
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 font-nunito text-xs text-gray-600">
                        Copy.PDF
                      </span>
                      <button
                        type="button"
                        aria-label="Download PDF"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </span>
                  </td>

                  {/* Shrinkage Type — wraps naturally like screenshot */}
                  <td className="px-4 py-3 font-nunito text-sm text-gray-700 max-w-[90px] leading-snug">
                    {row.shrinkageType}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{row.description}</td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-3 pr-6">
                    <span className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
                        aria-label={`Edit ${row.stockName}`}
                      >
                        <SquarePen className="h-[18px] w-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(row)}
                        className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
                        aria-label={`Delete ${row.stockName}`}
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
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit Shrinkage</h2>
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
              <span className="font-semibold text-gray-700">{selected.stockName}</span>?
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
