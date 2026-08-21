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
		<div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
			<div className="flex items-start justify-between gap-6">
				<div>
					<h1 className="text-2xl font-poppins font-medium text-gray-800">
						Inventory
					</h1>
					<div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500">
						<span>Admin</span>
						<span className="text-lg text-gray-400">›</span>
						<span className="text-gray-800">Inventory Management</span>
					</div>
				</div>

				<Link
					href="/admin/dashboard/inventory/create"
					className="mt-1 flex min-w-[157px] items-center justify-center rounded-lg bg-[#622581] px-4 py-3 text-sm font-nunito font-semibold text-white transition-colors hover:bg-[#52206d]"
				>
					Create Inventory Login
				</Link>
			</div>

			<section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
				<div className="px-7 py-7">
					<h2 className="text-base font-poppins font-medium text-gray-800">
						Inventory Login Details
					</h2>
				</div>

				<div className="overflow-hidden text-xs font-normal text-gray-800">
					<div className="grid h-11 grid-cols-[17%_17%_17%_17%_17%_15%] items-center bg-[#f3f3f3] text-left">
						<div className="px-3 whitespace-nowrap">Name</div>
						<div className="px-3 whitespace-nowrap">Email</div>
						<div className="px-3 whitespace-nowrap">Password</div>
						<div className="px-3 whitespace-nowrap">Mobile Number</div>
						<div className="px-3 whitespace-nowrap">Store</div>
						<div className="px-3 whitespace-nowrap text-center">Actions</div>
					</div>

					{inventoryLogins.map((inventory) => (
						<div
							key={inventory.id}
							className="grid h-[50px] grid-cols-[17%_17%_17%_17%_17%_15%] items-center border-b border-[#e2e6eb]"
						>
							<div className="px-3 whitespace-nowrap">{inventory.name}</div>
							<div className="px-3 whitespace-nowrap">{inventory.email}</div>
							<div className="px-3 whitespace-nowrap">{inventory.password}</div>
							<div className="px-3 whitespace-nowrap">{inventory.mobile}</div>
							<div className="px-3 whitespace-nowrap">{inventory.store}</div>
							<div className="px-3">
								<div className="flex items-center justify-center gap-3">
									<button
										type="button"
										onClick={() => handleEditClick(inventory)}
										className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
										aria-label={`Edit inventory login ${inventory.name}`}
									>
										<Edit className="h-[18px] w-[18px]" />
									</button>
									<button
										type="button"
										onClick={() => {
											setSelectedInventory(inventory);
											setIsDeleteModalOpen(true);
										}}
										className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
										aria-label={`Delete inventory login ${inventory.name}`}
									>
										<Trash2 className="h-[18px] w-[18px]" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

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
