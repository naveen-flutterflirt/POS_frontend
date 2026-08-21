"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SquarePen, Trash2, X } from "lucide-react";

type Stock = {
  id: number;
  stockCode: string;
  stockName: string;
  batchNo: string;
  uom: string;
  quantity: string;
  mnfDate: string;
  expiryDate: string;
  stockValue: string;
  receivedDate: string;
  store: string;
  transportCost: string;
  paymentStatus: "Paid" | "Pending";
  vendor: string;
  invoiceNumber: string;
  cgstIgstSgst: string;
  description: string;
};

const initialStocks: Stock[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  stockCode: "123456",
  stockName: "Madhuvana",
  batchNo: "01",
  uom: "513350",
  quantity: "01",
  mnfDate: "08/06/2025",
  expiryDate: "08/06/2025",
  stockValue: "20,000",
  receivedDate: "12/08/2025",
  store: "Madhuvana",
  transportCost: "₹20,000",
  paymentStatus: "Paid",
  vendor: "S. Neha",
  invoiceNumber: "12345567894",
  cgstIgstSgst: "2.5%, 2.5%, 2.5%",
  description: "Lorem ipsum dolor sit amet consectetur. Sit enim tempor",
}));

const columns = [
  "Stock Code", "Stock Name", "Batch No.", "UOM", "Quantity",
  "mnf Date", "Expiry Date", "Stock Value", "Received Date", "Store",
  "Transportation Cost", "Payment Status", "Vendor", "Invoice Number",
  "CGST, IGST, SGST", "Description", "Actions",
];

type StockField = keyof Omit<Stock, "id" | "paymentStatus">;

const editFields: { field: StockField; label: string }[] = [
  { field: "stockCode",     label: "Stock Code" },
  { field: "stockName",     label: "Stock Name" },
  { field: "batchNo",       label: "Batch No." },
  { field: "uom",           label: "UOM" },
  { field: "quantity",      label: "Quantity" },
  { field: "mnfDate",       label: "Mnf Date" },
  { field: "expiryDate",    label: "Expiry Date" },
  { field: "stockValue",    label: "Stock Value" },
  { field: "receivedDate",  label: "Received Date" },
  { field: "store",         label: "Store" },
  { field: "transportCost", label: "Transportation Cost" },
  { field: "vendor",        label: "Vendor" },
  { field: "invoiceNumber", label: "Invoice Number" },
  { field: "cgstIgstSgst",  label: "CGST, IGST, SGST" },
  { field: "description",   label: "Description" },
];

export default function StockManagementPage() {
  const router = useRouter();

  const [stocks, setStocks]             = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm]         = useState<Stock>({} as Stock);

  // Load stocks on mount
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/inventory/stores/STORE_DEFAULT/batches`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped: Stock[] = data.map((b: any) => ({
            id: b.id,
            stockCode: b.sku?.skuCode || b.skuId,
            stockName: b.sku?.product?.name || "Product SKU",
            batchNo: b.batchNumber,
            uom: b.sku?.uom || "PCS",
            quantity: String(b.quantity),
            mnfDate: b.manufacturingDate ? new Date(b.manufacturingDate).toLocaleDateString() : "",
            expiryDate: b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : "",
            stockValue: String(b.stockValue || 0),
            receivedDate: b.receivedDate ? new Date(b.receivedDate).toLocaleDateString() : "",
            store: b.warehouseId || "Warehouse",
            transportCost: String(b.transportationCost || 0),
            paymentStatus: b.paymentStatus || "Pending",
            vendor: b.vendorId || "Vendor",
            invoiceNumber: b.invoiceNumber || "",
            cgstIgstSgst: b.cgstIgstSgst || "",
            description: b.description || "",
          }));
          setStocks(mapped);
        }
      })
      .catch(console.error);
  }, []);

  /* ── Edit ── */
  const openEdit = (row: Stock) => {
    setEditForm(row);
    setSelectedStock(row);
    setIsEditOpen(true);
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    // Perform PUT adjustment on backend
    fetch(`${apiUrl}/inventory/adjust`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeId: editForm.store === "Warehouse" ? "STORE_DEFAULT" : editForm.store,
        skuId: editForm.stockCode,
        batchId: String(editForm.id),
        movementType: "ADJUSTMENT",
        quantity: Number(editForm.quantity),
        unitCost: Number(editForm.stockValue) / (Number(editForm.quantity) || 1),
        referenceType: "ADJUSTMENT",
        referenceId: "FRONTEND_EDIT",
        direction: "IN",
      }),
    })
      .then(() => {
        setStocks((prev) => prev.map((s) => (s.id === editForm.id ? editForm : s)));
        setIsEditOpen(false);
        setSelectedStock(null);
      })
      .catch(console.error);
  };
  const updateField = (field: keyof Stock, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  /* ── Delete ── */
  const openDelete = (row: Stock) => { setSelectedStock(row); setIsDeleteOpen(true); };
  const handleDeleteConfirm = () => {
    if (!selectedStock) return;
    setStocks((prev) => prev.filter((s) => s.id !== selectedStock.id));
    setIsDeleteOpen(false);
    setSelectedStock(null);
  };

  return (
    <div className="flex flex-col gap-4 font-nunito">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">
            Stock Management
          </h1>
          <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
            <span>Inventory</span>
            <span className="text-base leading-none">›</span>
            <span className="font-semibold text-gray-700">Stock Management</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/inventory/dashboard/stock-management/create")}
          className="rounded-lg bg-[#622581] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[#52206d] active:scale-95"
        >
          Add Stock
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="font-poppins text-base font-semibold text-gray-800">Stock Details</h2>
        </div>

        {/* scrollbar-none hides the bar but keeps horizontal scrolling functional */}
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[1400px] border-collapse font-nunito text-sm">
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
              {stocks.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 pl-6 text-center font-nunito text-gray-700">{row.stockCode}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.stockName}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.batchNo}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.uom}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.quantity}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.mnfDate}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.expiryDate}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.stockValue}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.receivedDate}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.store}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.transportCost}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    <span className={`font-nunito font-medium ${row.paymentStatus === "Paid" ? "text-green-600" : "text-red-500"}`}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.vendor}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.invoiceNumber}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-gray-700">{row.cgstIgstSgst}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-nunito text-sm text-gray-700">{row.description}</td>
                  <td className="whitespace-nowrap px-4 py-4 pr-6 text-center">
                    <span className="inline-flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
                        aria-label={`Edit stock ${row.stockCode}`}
                      >
                        <SquarePen className="h-[18px] w-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(row)}
                        className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
                        aria-label={`Delete stock ${row.stockCode}`}
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
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit Stock</h2>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close edit modal"
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
              {/* Payment Status */}
              <label className="font-nunito text-sm font-normal text-gray-600">
                Payment Status
                <select
                  value={editForm.paymentStatus}
                  onChange={(e) => updateField("paymentStatus", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581]"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
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
      {isDeleteOpen && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="font-poppins text-xl font-medium text-gray-800">Delete Stock?</h2>
            <p className="mt-2 font-nunito text-sm text-gray-500">
              Are you sure you want to delete stock{" "}
              <span className="font-semibold text-gray-700">{selectedStock.stockCode}</span>{" "}
              — {selectedStock.stockName}? This action cannot be undone.
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
