"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  pinCode: string;
};

const initialCustomers: Customer[] = [
  { id: 1, name: "N.Ananya",    email: "ananya@gmail.com",    phone: "+91 9999999999", pinCode: "513350" },
  { id: 2, name: "S.Bhavya",    email: "bhavya@gmail.com",    phone: "+91 9999999999", pinCode: "513350" },
  { id: 3, name: "k.Chaitanya", email: "chaitanya@gmail.com", phone: "+91 9999999999", pinCode: "513350" },
  { id: 4, name: "S.Neha",      email: "neha@gmail.com",      phone: "+91 9999999999", pinCode: "513350" },
  { id: 5, name: "T.Dharani",   email: "dharani@gmail.com",   phone: "+91 9999999999", pinCode: "513350" },
];

export default function CashierCustomerPage() {
  const [customers, setCustomers]           = useState(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData]     = useState<Customer>(initialCustomers[0]);
  const [isEditModalOpen, setIsEditModalOpen]   = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (customer: Customer) => { setSelectedCustomer(customer); setEditFormData(customer); setIsEditModalOpen(true); };
  const updateField = (field: keyof Customer, value: string) => setEditFormData((c) => ({ ...c, [field]: value }));
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomers((c) => c.map((x) => (x.id === editFormData.id ? editFormData : x)));
    setIsEditModalOpen(false); setSelectedCustomer(null);
  };
  const handleDelete = () => {
    if (!selectedCustomer) return;
    setCustomers((c) => c.filter((x) => x.id !== selectedCustomer.id));
    setIsDeleteModalOpen(false); setSelectedCustomer(null);
  };

  return (
    <div className="space-y-4 font-nunito">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-poppins text-xl font-semibold text-gray-900 sm:text-2xl">Customer</h1>
          <div className="mt-1 flex items-center gap-2 font-nunito text-sm text-gray-500">
            <span>Cashier</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span>
          </div>
        </div>
        <Link href="/admin/dashboard/cashier/customer/create" className="rounded-lg bg-[#622581] px-4 py-2.5 font-nunito text-sm font-semibold text-white transition-colors hover:bg-[#52206d]">
          Add Customer
        </Link>
      </div>

      <div className="bg-white">
        <div className="px-5 py-4 sm:px-7">
          <h2 className="font-poppins text-base font-medium text-gray-900">Customers Details</h2>
        </div>
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                {["Name", "Gmail", "Phone Number", "Pin Code", "Actions"].map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3 text-center font-nunito text-sm font-normal text-gray-600 first:pl-7 last:pr-7">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 pl-7 text-center font-nunito text-gray-700">{customer.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-center font-nunito text-gray-700">{customer.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-center font-nunito text-gray-700">{customer.phone}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-center font-nunito text-gray-700">{customer.pinCode}</td>
                  <td className="whitespace-nowrap px-4 py-3 pr-7 text-center">
                    <span className="inline-flex items-center justify-center gap-3">
                      <button type="button" onClick={() => handleEdit(customer)} className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50" aria-label={`Edit ${customer.name}`}><Edit className="h-[18px] w-[18px]" /></button>
                      <button type="button" onClick={() => { setSelectedCustomer(customer); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50" aria-label={`Delete ${customer.name}`}><Trash2 className="h-[18px] w-[18px]" /></button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-medium text-gray-800">Edit Customer</h2>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {([["name","Name"],["email","Gmail"],["phone","Phone Number"],["pinCode","Pin Code"]] as [keyof Customer,string][]).map(([field,label]) => (
                <label key={field} className="font-nunito text-sm text-gray-600">{label}
                  <input required value={editFormData[field]} onChange={(e) => updateField(field, e.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-nunito text-sm text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20" />
                </label>
              ))}
              <button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d] md:col-span-2">Update</button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="font-poppins text-xl font-medium text-gray-800">Delete Customer?</h2>
            <p className="mt-2 font-nunito text-sm text-gray-500">Are you sure you want to delete {selectedCustomer.name}?</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 font-nunito text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleDelete} className="rounded-lg bg-red-600 px-5 py-2.5 font-poppins text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
