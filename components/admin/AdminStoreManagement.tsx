"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useApi } from "@/context/ApiContext";
import { Edit, Trash2, X } from "lucide-react";

type Store = {
	id: number;
	name: string;
	code: string;
	address: string;
	state?: string;
};

const emptyStore: Store = {
	id: 0,
	name: "",
	code: "",
	address: "",
	state: "",
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function AdminStoreManagement() {
	const [stores, setStores] = useState<Store[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { get, put, del } = useApi();

	const [selectedStore, setSelectedStore] = useState<Store | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editFormData, setEditFormData] = useState<Store>(emptyStore);
	const [searchState, setSearchState] = useState("");

	const fetchStores = () => {
		setIsLoading(true);
		get("/store")
			.then((data: any) => {
				if (Array.isArray(data)) {
					setStores(data);
				}
			})
			.catch((error) => console.error("Error fetching stores:", error))
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		fetchStores();
	}, [get]);

	const handleEditClick = (store: Store) => {
		setSelectedStore(store);
		setEditFormData(store);
		setIsEditModalOpen(true);
	};

	const handleEditSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		put(`/store/${editFormData.id}`, {
			name: editFormData.name,
			code: editFormData.code,
			address: editFormData.address,
			state: editFormData.state,
		})
			.then(() => {
				fetchStores();
				setIsEditModalOpen(false);
				setSelectedStore(null);
			})
			.catch((error) => console.error("Failed to update store:", error));
	};

	const handleDeleteConfirm = () => {
		if (!selectedStore) return;
		del(`/store/${selectedStore.id}`)
			.then(() => {
				fetchStores();
				setIsDeleteModalOpen(false);
				setSelectedStore(null);
			})
			.catch((error) => console.error("Failed to delete store:", error));
	};

	return (
		<div className="space-y-4 font-nunito">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h1 className="font-poppins text-xl font-medium text-gray-800 sm:text-2xl">Store Management</h1>
					<div className="mt-1 flex items-center gap-2 font-nunito text-sm text-gray-500">
						<span>Admin</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Store Management</span>
					</div>
				</div>
				<Link href="/admin/dashboard/store-management/create" className="flex items-center justify-center rounded-lg bg-[#622581] px-4 py-2.5 font-nunito text-sm font-semibold text-white transition-colors hover:bg-[#52206d]">
					Add Store
				</Link>
			</div>

			<div className="bg-white">
				<div className="px-5 py-4 sm:px-7 flex flex-col sm:flex-row justify-between items-center gap-4">
					<h2 className="font-poppins text-base font-medium text-gray-800">Stores Details</h2>
					<select
						value={searchState}
						onChange={(e) => setSearchState(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-nunito focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none bg-white"
					>
						<option value="">All States</option>
						{INDIAN_STATES.map((state) => (
							<option key={state} value={state}>{state}</option>
						))}
					</select>
				</div>
				<div className="scrollbar-none overflow-x-auto">
					<table className="w-full min-w-[560px] border-collapse font-nunito text-sm">
						<thead>
							<tr className="border-y border-gray-200 bg-gray-50">
								{["Store Name", "Code", "Address", "State", "Actions"].map((col) => (
									<th key={col} className="whitespace-nowrap px-4 py-3 text-left font-nunito text-sm font-normal text-gray-600 first:pl-7 last:pr-7">{col}</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{isLoading ? (
								<tr>
									<td colSpan={4} className="py-12 text-center">
										<div className="flex flex-col items-center gap-3">
											<div className="h-8 w-8 animate-spin rounded-full border-4 border-[#622581] border-t-transparent" />
											<span className="font-nunito text-sm text-gray-500">Loading stores...</span>
										</div>
									</td>
								</tr>
							) : stores.length === 0 ? (
								<tr>
									<td colSpan={5} className="py-12 text-center font-nunito text-sm text-gray-400">
										No stores found matching your criteria.
									</td>
								</tr>
							) : (
								stores.filter(s => !searchState || s.state === searchState).map((store) => (
									<tr key={store.id} className="transition-colors hover:bg-gray-50">
										<td className="whitespace-nowrap px-4 py-3 pl-7">
											<div className="flex items-center gap-3">
												<div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
													<Image src="/Images/image.png" alt="Store" fill className="object-cover" />
												</div>
												<span className="font-nunito text-gray-700">{store.name}</span>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{store.code}</td>
										<td className="px-4 py-3 font-nunito text-sm text-gray-700 max-w-[320px] leading-snug">{store.address}</td>
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{store.state || "—"}</td>
										<td className="whitespace-nowrap px-4 py-3 pr-7">
											<div className="flex items-center gap-3">
												<button type="button" onClick={() => handleEditClick(store)} className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50" aria-label={`Edit store ${store.name}`}><Edit className="h-[18px] w-[18px]" /></button>
												<button type="button" onClick={() => { setSelectedStore(store); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50" aria-label={`Delete store ${store.name}`}><Trash2 className="h-[18px] w-[18px]" /></button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{isEditModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
						<div className="mb-5 flex items-center justify-between">
							<h2 className="text-xl font-poppins font-medium text-gray-800">Edit Store</h2>
							<button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close edit store modal"><X className="h-5 w-5" /></button>
						</div>
						<form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<label className="text-sm font-normal text-gray-600">Store Name<input required value={editFormData.name} onChange={(event) => setEditFormData({ ...editFormData, name: event.target.value })} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#622581]" /></label>
							<label className="text-sm font-normal text-gray-600">Code<input required value={editFormData.code} onChange={(event) => setEditFormData({ ...editFormData, code: event.target.value })} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#622581]" /></label>
							<label className="text-sm font-normal text-gray-600 md:col-span-2">Address<textarea required rows={3} value={editFormData.address} onChange={(event) => setEditFormData({ ...editFormData, address: event.target.value })} className="mt-1.5 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#622581]" /></label>
							<label className="text-sm font-normal text-gray-600 md:col-span-2">
								State
								<select value={editFormData.state || ""} onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#622581] bg-white">
									<option value="">Select State</option>
									{INDIAN_STATES.map((state) => (
										<option key={state} value={state}>{state}</option>
									))}
								</select>
							</label>
							<button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d] md:col-span-2">Update</button>
						</form>
					</div>
				</div>
			)}

			{isDeleteModalOpen && selectedStore && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
						<h2 className="text-xl font-poppins font-medium text-gray-800">Delete Store?</h2>
						<p className="mt-2 text-sm font-normal text-gray-500">Are you sure you want to delete {selectedStore.name}?</p>
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
