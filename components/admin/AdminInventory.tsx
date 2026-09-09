"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Edit, Trash2, X, Eye, EyeOff } from "lucide-react";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import { useApi } from "@/context/ApiContext";

type InventoryLogin = {
	id: number;
	name: string;
	email: string;
	password: string;
	mobile: string;
	store: string;
	posAccess: boolean;
};

const emptyInventory: InventoryLogin = {
	id: 0,
	name: "",
	email: "",
	password: "",
	mobile: "",
	store: "",
	posAccess: false,
};

export default function AdminInventory() {
	const { put, del } = useApi();
	const { data: rawUsers, isLoading, isRefreshing } = useCachedFetch<any[]>(
		"/users?role=INVENTORY",
		{ cacheKey: "cache:users:inventory", staleTtl: 30_000 }
	);

	const apiInventory = useMemo<InventoryLogin[]>(() => {
		if (!Array.isArray(rawUsers)) return [];

		return rawUsers.map((u: any) => ({
			id: u.id,
			name: u.name ?? "",
			email: u.email ?? "",
			password: "", // Do not load hash
			mobile: u.mobileNumber ?? "",
			store: u.store ?? "Madhuvana Spices",
			posAccess: u.posAccess ?? false,
		}));
	}, [rawUsers]);

	const [localOverrides, setLocalOverrides] = useState<Record<number, InventoryLogin | null>>({});
	
	const inventoryLogins = useMemo<InventoryLogin[]>(() => {
		return apiInventory
			.filter((c) => localOverrides[c.id] !== null)
			.map((c) => localOverrides[c.id] ?? c);
	}, [apiInventory, localOverrides]);

	const [selectedInventory, setSelectedInventory] = useState<InventoryLogin | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState<InventoryLogin>(emptyInventory);

	const handleToggleAccess = async (e: React.MouseEvent, inventory: InventoryLogin) => {
		e.stopPropagation();
		const newStatus = !inventory.posAccess;
		setLocalOverrides(prev => ({ ...prev, [inventory.id]: { ...inventory, posAccess: newStatus } }));
		
		try {
			await put(`/users/${inventory.id}`, { posAccess: newStatus });
		} catch (error) {
			console.error("Failed to update access:", error);
			// Revert on error
			setLocalOverrides(prev => ({ ...prev, [inventory.id]: inventory }));
		}
	};

	const handleRowClick = (inventory: InventoryLogin) => {
		setSelectedInventory(inventory);
		setShowPassword(false);
		setIsViewModalOpen(true);
	};

	const handleEditClick = (inventory: InventoryLogin) => {
		setSelectedInventory(inventory);
		setFormData(inventory);
		setIsEditModalOpen(true);
	};

	const handleEdit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const payload = { ...formData };
			if (!payload.password) {
				delete (payload as any).password;
			}
			await put(`/users/${formData.id}`, payload);
			setLocalOverrides(prev => ({ ...prev, [formData.id]: formData }));
			setIsEditModalOpen(false);
			setSelectedInventory(null);
		} catch (error) {
			console.error("Failed to update inventory user:", error);
			alert("Failed to update user. Please try again.");
		}
	};

	const handleDeleteConfirm = async () => {
		if (!selectedInventory) return;
		try {
			await del(`/users/${selectedInventory.id}`);
			setLocalOverrides(prev => ({ ...prev, [selectedInventory.id]: null }));
			setIsDeleteModalOpen(false);
			setSelectedInventory(null);
		} catch (error: any) {
			if (error.response && error.response.status === 404) {
				setLocalOverrides(prev => ({ ...prev, [selectedInventory.id]: null }));
				setIsDeleteModalOpen(false);
				setSelectedInventory(null);
			} else {
				console.error("Failed to delete inventory user:", error);
				alert("Failed to delete user. Please try again.");
			}
		}
	};

	const updateField = (field: keyof InventoryLogin, value: string) => {
		setFormData((currentData) => ({ ...currentData, [field]: value }));
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
				<div className="px-5 py-4 sm:px-7 flex items-center gap-3">
					<h2 className="font-poppins text-base font-medium text-gray-800">Inventory Login Details</h2>
					{isRefreshing && (
						<span className="flex items-center gap-1.5 rounded-full bg-[#622581]/10 px-2.5 py-0.5 font-nunito text-xs text-[#622581]">
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#622581]" />
							Refreshing
						</span>
					)}
				</div>
				<div className="scrollbar-none overflow-x-auto">
					<table className="w-full min-w-[600px] border-collapse font-nunito text-sm">
						<thead>
							<tr className="border-y border-gray-200 bg-gray-50">
								{["Name", "Email", "Mobile Number", "Store", "POS Access", "Actions"].map((col) => (
									<th key={col} className="whitespace-nowrap px-4 py-3 text-left font-nunito text-sm font-normal text-gray-600 first:pl-7 last:pr-7">{col}</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{inventoryLogins.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-12 text-center">
										{isLoading ? (
											<div className="flex flex-col items-center gap-3">
												<div className="h-8 w-8 animate-spin rounded-full border-4 border-[#622581] border-t-transparent" />
												<span className="font-nunito text-sm text-gray-500">Loading inventory users...</span>
											</div>
										) : (
											<span className="font-nunito text-sm text-gray-400">No inventory users found. Create one to get started.</span>
										)}
									</td>
								</tr>
							) : inventoryLogins.map((inventory) => (
								<tr key={inventory.id} className="transition-colors hover:bg-gray-50">
									<td className="whitespace-nowrap px-4 py-3 pl-7 font-nunito text-gray-700">{inventory.name}</td>
									<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{inventory.email}</td>
									<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{inventory.mobile}</td>
									<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{inventory.store}</td>
									<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
										<button
											onClick={(e) => handleToggleAccess(e, inventory)}
											className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${inventory.posAccess ? 'bg-[#622581]' : 'bg-gray-200'}`}
										>
											<span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${inventory.posAccess ? 'translate-x-4' : 'translate-x-1'}`} />
										</button>
									</td>
									<td className="whitespace-nowrap px-4 py-3 pr-7" onClick={(e) => e.stopPropagation()}>
										<div className="flex items-center gap-3">
											<button type="button" onClick={() => handleRowClick(inventory)} className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100" aria-label={`View details for ${inventory.name}`}><Eye className="h-[18px] w-[18px]" /></button>
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
						<form onSubmit={handleEdit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{([
								["name", "Name"],
								["email", "Email"],
								["password", "Password"],
								["mobile", "Mobile Number"],
								["store", "Store"],
							] as [keyof InventoryLogin, string][]).map(([field, label]) => (
								<label key={field} className="text-sm font-normal text-gray-600">
									{label} {field === "password" && <span className="text-xs text-gray-400">(leave blank to keep current)</span>}
									<input
										required={field !== "password"}
										type={field === "password" ? "password" : "text"}
										value={formData[field] as string}
										onChange={(event) => updateField(field, event.target.value)}
										className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-normal text-gray-700 outline-none transition focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
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

			{/* View Details Modal */}
			{isViewModalOpen && selectedInventory && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsViewModalOpen(false)}>
					<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-2xl font-poppins font-medium text-gray-800">Inventory Details</h2>
							<button onClick={() => setIsViewModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 transition-colors">
								<X className="h-5 w-5" />
							</button>
						</div>
						
						<div className="space-y-4">
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">Name</p>
								<p className="text-sm font-nunito font-medium text-gray-800">{selectedInventory.name}</p>
							</div>
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">Email</p>
								<p className="text-sm font-nunito font-medium text-gray-800">{selectedInventory.email}</p>
							</div>
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">Mobile</p>
								<p className="text-sm font-nunito font-medium text-gray-800">{selectedInventory.mobile}</p>
							</div>
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">Store</p>
								<p className="text-sm font-nunito font-medium text-gray-800">{selectedInventory.store}</p>
							</div>
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">POS Access</p>
								<span className={`inline-block mt-1 px-2.5 py-1 text-xs font-nunito font-semibold rounded-md ${selectedInventory.posAccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
									{selectedInventory.posAccess ? "Granted" : "Revoked"}
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
