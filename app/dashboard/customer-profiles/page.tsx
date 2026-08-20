"use client";

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
  { id: 1, name: "N.Ananya", email: "ananya@gmail.com", phone: "+91 9999999999", pinCode: "513350" },
  { id: 2, name: "S.Bhavya", email: "bhavya@gmail.com", phone: "+91 9999999999", pinCode: "513350" },
  { id: 3, name: "k.Chaitanya", email: "chaitanya@gmail.com", phone: "+91 9999999999", pinCode: "513350" },
  { id: 4, name: "S.Neha", email: "neha@gmail.com", phone: "+91 9999999999", pinCode: "513350" },
  { id: 5, name: "T.Dharani", email: "dharani@gmail.com", phone: "+91 9999999999", pinCode: "513350" },
];

export default function CustomerProfilesPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData] = useState<Customer>(initialCustomers[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditFormData(customer);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCustomers((currentCustomers) => currentCustomers.map((customer) => customer.id === editFormData.id ? editFormData : customer));
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCustomer) return;
    setCustomers((currentCustomers) => currentCustomers.filter((customer) => customer.id !== selectedCustomer.id));
    setIsDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const updateField = (field: keyof Customer, value: string) => {
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
          <span className="text-gray-800">Customer Profiles</span>
        </div>
      </div>

      <section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
        <div className="px-7 py-7">
          <h2 className="text-base font-poppins font-medium text-gray-800">Customers Details</h2>
        </div>

        <div className="overflow-hidden text-xs font-normal text-gray-800">
          <div className="grid h-12 grid-cols-[20%_20%_20%_20%_20%] items-center bg-[#f3f3f3] text-left">
            <div className="px-3 text-center whitespace-nowrap">Name</div>
            <div className="px-3 text-center whitespace-nowrap">Gmail</div>
            <div className="px-3 text-center whitespace-nowrap">Phone Number</div>
            <div className="px-3 text-center whitespace-nowrap">Pin Code</div>
            <div className="px-3 text-center whitespace-nowrap">Actions</div>
          </div>

          {customers.map((customer) => (
            <div key={customer.id} className="grid h-[55px] grid-cols-[20%_20%_20%_20%_20%] items-center border-b border-[#e2e6eb]">
              <div className="px-3 text-center whitespace-nowrap">{customer.name}</div>
              <div className="px-3 text-center whitespace-nowrap">{customer.email}</div>
              <div className="px-3 text-center whitespace-nowrap">{customer.phone}</div>
              <div className="px-3 text-center whitespace-nowrap">{customer.pinCode}</div>
              <div className="px-3"><div className="flex items-center justify-center gap-3">
                <button type="button" onClick={() => handleEditClick(customer)} className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50" aria-label={`Edit customer ${customer.name}`}><Edit className="h-[18px] w-[18px]" /></button>
                <button type="button" onClick={() => { setSelectedCustomer(customer); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50" aria-label={`Delete customer ${customer.name}`}><Trash2 className="h-[18px] w-[18px]" /></button>
              </div></div>
            </div>
          ))}
        </div>
      </section>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-poppins font-medium text-gray-800">Edit Customer</h2><button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close edit customer modal"><X className="h-5 w-5" /></button></div>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {([["name", "Name"], ["email", "Gmail"], ["phone", "Phone Number"], ["pinCode", "Pin Code"]] as [keyof Customer, string][]).map(([field, label]) => <label key={field} className="text-sm font-normal text-gray-600">{label}<input required value={editFormData[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20" /></label>)}
            <button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d] md:col-span-2">Update</button>
          </form>
        </div></div>
      )}

      {isDeleteModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
          <h2 className="text-xl font-poppins font-medium text-gray-800">Delete Customer?</h2><p className="mt-2 text-sm font-normal text-gray-500">Are you sure you want to delete {selectedCustomer.name}?</p>
          <div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-normal text-gray-600 hover:bg-gray-50">Cancel</button><button type="button" onClick={handleDeleteConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700">Delete</button></div>
        </div></div>
      )}
    </div>
  );
}
