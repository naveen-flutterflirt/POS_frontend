"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SquarePen, Trash2, X } from "lucide-react";

type Return = {
  id: number;
  invoice: string;
  customer: string;
  mobile: string;
  product: string;
  qty: string;
  refundType: string;
  approvedBy: string;
};

const initialReturns: Return[] = [
  { id: 1, invoice: "1233434", customer: "M.Ram", mobile: "9999999999", product: "Turmeric Powder", qty: "01", refundType: "Cash", approvedBy: "1,450" },
  { id: 2, invoice: "1233434", customer: "M.Ram", mobile: "9999999999", product: "Turmeric Powder", qty: "01", refundType: "Cash", approvedBy: "1,450" },
  { id: 3, invoice: "1233434", customer: "M.Ram", mobile: "9999999999", product: "Turmeric Powder", qty: "01", refundType: "Cash", approvedBy: "1,450" },
  { id: 4, invoice: "1233434", customer: "M.Ram", mobile: "9999999999", product: "Turmeric Powder", qty: "01", refundType: "Cash", approvedBy: "1,450" },
  { id: 5, invoice: "1233434", customer: "M.Ram", mobile: "9999999999", product: "Turmeric Powder", qty: "01", refundType: "Cash", approvedBy: "1,450" },
];

const editFields: { field: keyof Omit<Return, "id">; label: string }[] = [
  { field: "invoice",    label: "Invoice No." },
  { field: "customer",   label: "Customer" },
  { field: "mobile",     label: "Mobile No" },
  { field: "product",    label: "Product" },
  { field: "qty",        label: "Quantity" },
  { field: "refundType", label: "Refund Type" },
  { field: "approvedBy", label: "Approved By" },
];

export default function ReturnsPage() {
  const router = useRouter();

  const [returns, setReturns] = useState<Return[]>(initialReturns);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState<Return>(initialReturns[0]);

  /* ── Edit ── */
  const openEdit = (row: Return) => {
    setEditForm(row);
    setSelectedReturn(row);
    setIsEditOpen(true);
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturns((prev) => prev.map((r) => (r.id === editForm.id ? editForm : r)));
    setIsEditOpen(false);
    setSelectedReturn(null);
  };
  const updateField = (field: keyof Return, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  /* ── Delete ── */
  const openDelete = (row: Return) => {
    setSelectedReturn(row);
    setIsDeleteOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (!selectedReturn) return;
    setReturns((prev) => prev.filter((r) => r.id !== selectedReturn.id));
    setIsDeleteOpen(false);
    setSelectedReturn(null);
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">Returns</h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Cashier</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Returns Management</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/cashier/dashboard/returns/create")}
          className="rounded-lg bg-[#622581] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d] active:scale-95"
        >
          Add Returns
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="font-poppins text-base font-semibold text-gray-800">Returns Details</h2>
        </div>

        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {["Invoice No.", "Customer", "Mobile No", "Product", "Quantity", "Refund Type", "Approved By", "Actions"].map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-4 py-3 text-center font-nunito text-sm font-normal text-gray-600 first:pl-6 last:pr-6"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returns.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 pl-6 text-center font-nunito text-gray-700">{row.invoice}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.customer}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.mobile}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.product}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.qty}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.refundType}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.approvedBy}</td>
                  <td className="whitespace-nowrap px-4 py-4 pr-6 text-center">
                    <span className="inline-flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
                        aria-label={`Edit return for ${row.customer}`}
                      >
                        <SquarePen className="h-[18px] w-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(row)}
                        className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
                        aria-label={`Delete return for ${row.customer}`}
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
          <div className="scrollbar-none w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit Return</h2>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close edit return modal"
              >
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
              <button
                type="submit"
                className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white transition-colors hover:bg-[#52206d] md:col-span-2"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {isDeleteOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="font-poppins text-xl font-medium text-gray-800">Delete Return?</h2>
            <p className="mt-2 font-nunito text-sm text-gray-500">
              Are you sure you want to delete the return for{" "}
              <span className="font-semibold text-gray-700">{selectedReturn.customer}</span>?
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-nunito text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-lg bg-red-600 px-5 py-2.5 font-poppins text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
