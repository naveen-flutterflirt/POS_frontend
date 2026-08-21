"use client";

import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import Link from "next/link";

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

export default function CashierCustomerPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData] = useState<Customer>(initialCustomers[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditFormData(customer);
    setIsEditModalOpen(true);
  };

  const updateField = (field: keyof Customer, value: string) => {
    setEditFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCustomers((currentCustomers) => currentCustomers.map((customer) => customer.id === editFormData.id ? editFormData : customer));
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDelete = () => {
    if (!selectedCustomer) return;
    setCustomers((currentCustomers) => currentCustomers.filter((customer) => customer.id !== selectedCustomer.id));
    setIsDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <main className="h-dvh overflow-hidden bg-gray-50 font-nunito text-[#111111]">
      <div className="h-full overflow-hidden px-5 py-6 sm:px-8 lg:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-poppins text-xl font-semibold text-gray-900 sm:text-2xl">Customer</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span>Cashier</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span>
            </div>
          </div>
          <Link href="/cashier/dashboard/customer/create" className="rounded-xl bg-[#622581] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#52206d] sm:px-7 sm:py-3">Add Customer</Link>
        </div>

        <section className="mt-6 h-[calc(100%-108px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
          <div className="px-7 py-7"><h2 className="font-poppins text-base font-medium text-gray-900">Customers Details</h2></div>
          <div className="overflow-hidden text-xs font-normal text-gray-800">
            <div className="grid h-11 grid-cols-[20%_20%_20%_20%_20%] items-center bg-[#f3f3f3] text-center"><div>Name</div><div>Gmail</div><div>Phone Number</div><div>Pin Code</div><div>Actions</div></div>
            {customers.map((customer) => <div key={customer.id} className="grid h-[52px] grid-cols-[20%_20%_20%_20%_20%] items-center border-b border-[#e2e6eb] text-center"><div>{customer.name}</div><div>{customer.email}</div><div>{customer.phone}</div><div>{customer.pinCode}</div><div className="flex justify-center gap-3"><button type="button" onClick={() => handleEdit(customer)} className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50" aria-label={`Edit ${customer.name}`}><Edit className="h-[18px] w-[18px]" /></button><button type="button" onClick={() => { setSelectedCustomer(customer); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50" aria-label={`Delete ${customer.name}`}><Trash2 className="h-[18px] w-[18px]" /></button></div></div>)}
          </div>
        </section>
      </div>

      {isEditModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="font-poppins text-xl font-medium">Edit Customer</h2><button type="button" onClick={() => setIsEditModalOpen(false)} aria-label="Close edit customer modal"><X className="h-5 w-5" /></button></div><form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">{([["name","Name"],["email","Gmail"],["phone","Phone Number"],["pinCode","Pin Code"]] as [keyof Customer,string][]).map(([field,label]) => <label key={field} className="text-sm text-gray-600">{label}<input required value={editFormData[field]} onChange={(event) => updateField(field,event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#622581]" /></label>)}<button type="submit" className="rounded-lg bg-[#622581] py-2.5 text-white sm:col-span-2">Update</button></form></div></div>}
      {isDeleteModalOpen && selectedCustomer && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="rounded-2xl bg-white p-6 text-center shadow-2xl"><h2 className="font-poppins text-xl">Delete Customer?</h2><p className="my-4 text-sm text-gray-500">Are you sure you want to delete {selectedCustomer.name}?</p><button type="button" onClick={() => setIsDeleteModalOpen(false)} className="mr-2 rounded-lg border px-4 py-2">Cancel</button><button type="button" onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white">Delete</button></div></div>}
    </main>
  );
}
