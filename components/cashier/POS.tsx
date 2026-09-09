"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SquarePen, Trash2, X } from "lucide-react";

type Item = {
  id: number;
  sno: string;
  name: string;
  code: string;
  mrp: string;
  sp: string;
  qty: string;
  amount: string;
};

const initialItems: Item[] = [
  { id: 1, sno: "01", name: "Turmeric Powder", code: "1234", mrp: "120 ₹", sp: "100 ₹", qty: "01", amount: "100 (₹)" },
  { id: 2, sno: "02", name: "Honey",           code: "4567", mrp: "120 ₹", sp: "100 ₹", qty: "01", amount: "100 (₹)" },
  { id: 3, sno: "03", name: "Ghee",            code: "7894", mrp: "120 ₹", sp: "100 ₹", qty: "01", amount: "100 (₹)" },
];

const editFields: { field: keyof Omit<Item, "id" | "sno">; label: string }[] = [
  { field: "name",   label: "Item" },
  { field: "code",   label: "Item Code" },
  { field: "mrp",    label: "MRP" },
  { field: "sp",     label: "SP (₹)" },
  { field: "qty",    label: "Quantity" },
  { field: "amount", label: "Amount (₹)" },
];

export default function POS() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen]       = useState(false);
  const [editForm, setEditForm]         = useState<Item>(initialItems[0]);

  const [addForm, setAddForm] = useState<Omit<Item, "id" | "sno">>({
    name: "", code: "", mrp: "", sp: "", qty: "", amount: "",
  });

  const filtered = items.filter(
    (it) =>
      it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.code.includes(search),
  );

  /* ── Edit ── */
  const openEdit = (item: Item) => { setEditForm(item); setSelectedItem(item); setIsEditOpen(true); };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setItems((prev) => prev.map((it) => (it.id === editForm.id ? editForm : it)));
    setIsEditOpen(false);
  };
  const updateEdit = (field: keyof Item, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  /* ── Delete ── */
  const openDelete = (item: Item) => { setSelectedItem(item); setIsDeleteOpen(true); };
  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    setItems((prev) => prev.filter((it) => it.id !== selectedItem.id));
    setIsDeleteOpen(false);
    setSelectedItem(null);
  };

  /* ── Add New Item ── */
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextSno = String(items.length + 1).padStart(2, "0");
    setItems((prev) => [
      ...prev,
      { id: Date.now(), sno: nextSno, ...addForm },
    ]);
    setAddForm({ name: "", code: "", mrp: "", sp: "", qty: "", amount: "" });
    setIsAddOpen(false);
  };
  const updateAdd = (field: keyof typeof addForm, value: string) =>
    setAddForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div>
        <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">POS</h1>
        <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
          <span>Cashier</span>
          <span className="text-base leading-none">›</span>
          <span className="font-semibold text-gray-700">POS</span>
        </div>
      </div>

      {/* ── Search + Add New Item ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Item Name/Item Code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 font-nunito text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="whitespace-nowrap rounded-lg border border-[#622581] bg-white px-5 py-2.5 font-poppins text-sm font-semibold text-[#622581] transition-colors hover:bg-[#622581]/5"
        >
          Add New Item
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="font-poppins text-base font-semibold text-gray-800">Item Details</h2>
        </div>

        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {["S.No", "Item", "Item Code", "MRP", "SP(₹)", "Quantity", "Amount(₹)", "Actions"].map((col) => (
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
              {filtered.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 pl-6 text-center font-nunito text-gray-700">{row.sno}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.name}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.code}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.mrp}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.sp}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.qty}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.amount}</td>
                  <td className="whitespace-nowrap px-4 py-4 pr-6 text-center">
                    <span className="inline-flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
                        aria-label={`Edit ${row.name}`}
                      >
                        <SquarePen className="h-[18px] w-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(row)}
                        className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
                        aria-label={`Delete ${row.name}`}
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

        {/* Proceed to Billing */}
        <div className="flex justify-end px-6 py-5">
          <button
            type="button"
            onClick={() => router.push("/cashier/dashboard/pos/billing")}
            className="rounded-lg bg-[#622581] px-6 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d] active:scale-95"
          >
            Proceed to Billing
          </button>
        </div>
      </div>

      {/* ── Add New Item Modal ── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-medium text-gray-800">Add New Item</h2>
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {editFields.map(({ field, label }) => (
                <label key={field} className="font-nunito text-sm font-normal text-gray-600">
                  {label}
                  <input
                    required
                    value={addForm[field]}
                    onChange={(e) => updateAdd(field, e.target.value)}
                    placeholder={`Enter ${label}`}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                  />
                </label>
              ))}
              <button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white transition-colors hover:bg-[#52206d] md:col-span-2">
                Add Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit Item</h2>
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
                    onChange={(e) => updateEdit(field, e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
                  />
                </label>
              ))}
              <button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white transition-colors hover:bg-[#52206d] md:col-span-2">
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {isDeleteOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="font-poppins text-xl font-medium text-gray-800">Delete Item?</h2>
            <p className="mt-2 font-nunito text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">{selectedItem.name}</span>?
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
