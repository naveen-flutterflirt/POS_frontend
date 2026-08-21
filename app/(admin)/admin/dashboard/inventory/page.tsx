"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

type InventoryLogin = {
	id: number;
	name: string;
	email: string;
	password: string;
	mobile: string;
	store: string;
};

const initialInventoryLogins: InventoryLogin[] = Array.from({ length: 5 }, (_, index) => ({
	id: index + 1,
	name: "S. Madhavan",
	email: "madhuvan@gmail.com",
	password: "maddy123",
	mobile: "+91 9686863356",
	store: "Madhuvana Spices",
}));

export default function InventoryPage() {
	const [inventoryLogins, setInventoryLogins] = useState(initialInventoryLogins);
	const [selectedInventory, setSelectedInventory] = useState<InventoryLogin | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editFormData, setEditFormData] = useState<InventoryLogin>(initialInventoryLogins[0]);

	const handleEditClick = (inventory: InventoryLogin) => {
		setSelectedInventory(inventory);
		setEditFormData(inventory);
		setIsEditModalOpen(true);
	};

	const handleEditSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setInventoryLogins((currentLogins) =>
			currentLogins.map((inventory) =>
				inventory.id === editFormData.id ? editFormData : inventory,
			),
		);
		setIsEditModalOpen(false);
		setSelectedInventory(null);
	};

	const handleDeleteConfirm = () => {
		if (!selectedInventory) return;
		setInventoryLogins((currentLogins) =>
			currentLogins.filter((inventory) => inventory.id !== selectedInventory.id),
		);
		setIsDeleteModalOpen(false);
		setSelectedInventory(null);
	};

	const updateField = (field: keyof InventoryLogin, value: string) => {
		setEditFormData((currentData) => ({ ...currentData, [field]: value }));
	};

	return (
		<div className="space-y-4 font-nunito">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h1 className="font-poppins text-xl font-medium text-gray-800 sm:text-2xl">Inventory</h1>
					<div className="mt-1 flex items-center gap-2 font-nunito text-sm text-gray-500">
						<span>Admin</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Inventory Management</span>
					</div>
				</div>
				<Link href="/admin/dashboard/inventory/create" className="flex items-center justify-center rounded-lg bg-[#622581] px-4 py-2.5 font-nunito text-sm font-semibold text-white transition-colors hover:bg-[#52206d]">
					Create Inventory Login
				</Link>
			</div>

			<div className="bg-white">
				<div className="px-5 py-4 sm:px-7">
					<h2 className="font-poppins text-base font-medium text-gray-800">Inventory Login Details</h2>
				</div>
				<div className="scrollbar-none overflow-x-auto">
					<table className="w-full min-w-[600px] border-collapse font-nunito text-sm">
						<thead>
							<tr className="border-y border-gray-200 bg-gray-50">
								{["Name", "Email", "Password", "Mobile Number", "Store", "Actions"].map((col) => (
									<th key={col} className="whitespace-nowrap px-4 py-3 text-left font-nunito text-sm font-normal text-gray-600 first:pl-7 last:pr-7">{col}</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{inventoryLogins.map((inventory) => (
								<tr key={inventory.id} className="transition-colors hover:bg-gray-50">
									<td className="whitespace-nowrap px-4 py-3 pl-7 font-nunito text-gray-700">{inventory.name}</td>
									<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{inventory.email}</td>
									<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{inventory.password}</td>
									<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{inventory.mobile}</td>
									<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{inventory.store}</td>
									<td className="whitespace-nowrap px-4 py-3 pr-7">
										<div className="flex items-center gap-3">
											<button type="button" onClick={() => handleEditClick(inventory)} className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50" aria-label={`Edit inventory login ${inventory.name}`}><Edit className="h-[18px] w-[18px]" /></button>
											<button type="button" onClick={() => { setSelectedInventory(inventory); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50" aria-label={`Delete inventory login ${inventory.name}`}><Trash2 className="h-[18px] w-[18px]" /></button>
										</div>
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
							<h2 className="text-xl font-poppins font-medium text-gray-800">Edit Inventory Login</h2>
							<button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close edit inventory modal">
								<X className="h-5 w-5" />
							</button>
						</div>
						<form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{([
								["name", "Name"],
								["email", "Email"],
								["password", "Password"],
								["mobile", "Mobile Number"],
								["store", "Store"],
							] as [keyof InventoryLogin, string][]).map(([field, label]) => (
								<label key={field} className="text-sm font-normal text-gray-600">
									{label}
									<input
										required
										value={editFormData[field]}
										onChange={(event) => updateField(field, event.target.value)}
										className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
									/>
								</label>
							))}
							<button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d] md:col-span-2">Update</button>
						</form>
					</div>
				</div>
			)}

			{isDeleteModalOpen && selectedInventory && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
						<h2 className="text-xl font-poppins font-medium text-gray-800">Delete Inventory Login?</h2>
						<p className="mt-2 text-sm font-normal text-gray-500">Are you sure you want to delete {selectedInventory.name}?</p>
						<div className="mt-6 flex justify-center gap-3">
							<button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-normal text-gray-600 hover:bg-gray-50">Cancel</button>
							<button type="button" onClick={handleDeleteConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700">Delete</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
