"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, Star, Trash2, X } from "lucide-react";

type Sale = {
  id: number;
  invoice: string;
  customer: string;
  phone: string;
  product: string;
  qty: string;
  discount: string;
  cgst: string;
  sgst: string;
  paymentType: string;
  paymentReceived: string;
  loyalty: number;
};

const initialSales: Sale[] = [
  { id: 1, invoice: "1233434", customer: "M.Ram",     phone: "9999999999", product: "Turmeric Powder", qty: "01", discount: "10%", cgst: "2.5%", sgst: "2.5%", paymentType: "UPI", paymentReceived: "1,450", loyalty: 10 },
  { id: 2, invoice: "1233434", customer: "Sita",      phone: "9999999999", product: "Turmeric Powder", qty: "01", discount: "10%", cgst: "2.5%", sgst: "2.5%", paymentType: "UPI", paymentReceived: "1,450", loyalty: 10 },
  { id: 3, invoice: "1233434", customer: "Lakshman",  phone: "9999999999", product: "Turmeric Powder", qty: "01", discount: "10%", cgst: "2.5%", sgst: "2.5%", paymentType: "UPI", paymentReceived: "1,450", loyalty: 10 },
  { id: 4, invoice: "1233434", customer: "Githa",     phone: "9999999999", product: "Turmeric Powder", qty: "01", discount: "10%", cgst: "2.5%", sgst: "2.5%", paymentType: "UPI", paymentReceived: "1,450", loyalty: 10 },
  { id: 5, invoice: "1233434", customer: "Chandhana", phone: "9999999999", product: "Turmeric Powder", qty: "01", discount: "10%", cgst: "2.5%", sgst: "2.5%", paymentType: "UPI", paymentReceived: "1,450", loyalty: 10 },
];

const columns = [
  "Invoice No.",
  "Customer",
  "Ph No",
  "Product",
  "Quantity",
  "Discount",
  "CGST",
  "SGST",
  "Payment Type",
  "Payment Received",
  "Loyality Points",
  "Actions",
];

const editFields: { field: keyof Omit<Sale, "id" | "loyalty">; label: string }[] = [
  { field: "invoice",         label: "Invoice No." },
  { field: "customer",        label: "Customer" },
  { field: "phone",           label: "Ph No" },
  { field: "product",         label: "Product" },
  { field: "qty",             label: "Quantity" },
  { field: "discount",        label: "Discount" },
  { field: "cgst",            label: "CGST" },
  { field: "sgst",            label: "SGST" },
  { field: "paymentType",     label: "Payment Type" },
  { field: "paymentReceived", label: "Payment Received" },
];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Sale>(initialSales[0]);

  const router = useRouter();

  /* ── Edit ── */
  const handleEditClick = (sale: Sale) => {
    setSelectedSale(sale);
    setEditFormData(sale);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSales((current) =>
      current.map((s) => (s.id === editFormData.id ? editFormData : s))
    );
    setIsEditModalOpen(false);
    setSelectedSale(null);
  };

  const updateField = (field: keyof Sale, value: string) => {
    setEditFormData((current) => ({ ...current, [field]: value }));
  };

  /* ── Delete ── */
  const handleDeleteClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedSale) return;
    setSales((current) => current.filter((s) => s.id !== selectedSale.id));
    setIsDeleteModalOpen(false);
    setSelectedSale(null);
  };

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">Sales</h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Cashier</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Sales Management</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/cashier/dashboard/sales/create")}
          className="rounded-lg bg-[#622581] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d] active:scale-95"
        >
          Add Sales
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="font-poppins text-base font-semibold text-gray-800">Sales Details</h2>
        </div>

        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {columns.map((col) => (
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
              {sales.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 pl-6 text-center font-nunito text-gray-700">{row.invoice}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.customer}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.phone}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.product}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.qty}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.discount}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.cgst}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.sgst}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.paymentType}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.paymentReceived}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-1 font-nunito text-gray-700">
                      {row.loyalty}
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 pr-6 text-center">
                    <span className="inline-flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditClick(row)}
                        className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
                        aria-label={`Edit sale for ${row.customer}`}
                      >
                        <Edit className="h-[18px] w-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(row)}
                        className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
                        aria-label={`Delete sale for ${row.customer}`}
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
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="scrollbar-none w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit Sale</h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close edit sale modal"
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
                    value={editFormData[field] as string}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm font-normal text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                  />
                </label>
              ))}

              {/* Loyalty points — full width */}
              <label className="font-nunito text-sm font-normal text-gray-600 md:col-span-2">
                Loyalty Points
                <input
                  required
                  type="number"
                  min={0}
                  value={editFormData.loyalty}
                  onChange={(e) => updateField("loyalty", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm font-normal text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20 md:w-1/2"
                />
              </label>

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
      {isDeleteModalOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="font-poppins text-xl font-medium text-gray-800">Delete Sale?</h2>
            <p className="mt-2 font-nunito text-sm font-normal text-gray-500">
              Are you sure you want to delete the sale for{" "}
              <span className="font-semibold text-gray-700">{selectedSale.customer}</span>?
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-nunito text-sm font-normal text-gray-600 transition-colors hover:bg-gray-50"
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
