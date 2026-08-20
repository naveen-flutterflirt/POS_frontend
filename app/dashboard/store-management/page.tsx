"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

type Store = {
	id: number;
	name: string;
	code: string;
	address: string;
};

const initialStores: Store[] = Array.from({ length: 5 }, (_, index) => ({
	id: index + 1,
	name: "Madhuvana Spices",
	code: "MS123",
	address: "Sree GuruRaya Mansion, No.759 3rd Floor, 8th Main Road 3rd Phase, JP Nagar, Bengaluru, Karnataka 560078.",
}));

export default function StoreManagementPage() {
	const [stores, setStores] = useState(initialStores);
	const [selectedStore, setSelectedStore] = useState<Store | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editFormData, setEditFormData] = useState<Store>(initialStores[0]);

	const handleEditClick = (store: Store) => {
		setSelectedStore(store);
		setEditFormData(store);
		setIsEditModalOpen(true);
	};

	const handleEditSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setStores((currentStores) =>
			currentStores.map((store) =>
				store.id === editFormData.id ? editFormData : store,
			),
		);
		setIsEditModalOpen(false);
		setSelectedStore(null);
	};

	const handleDeleteConfirm = () => {
		if (!selectedStore) return;
		setStores((currentStores) =>
			currentStores.filter((store) => store.id !== selectedStore.id),
		);
		setIsDeleteModalOpen(false);
		setSelectedStore(null);
	};

	return (
		<div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
			<div className="flex items-start justify-between gap-6">
				<div>
					<h1 className="text-2xl font-poppins font-medium text-gray-800">
						Store Management
					</h1>
					<div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500">
						<span>Admin</span>
						<span className="text-lg text-gray-400">›</span>
						<span className="text-gray-800">Store Management</span>
					</div>
				</div>

				<Link
					href="/dashboard/store-management/create"
					className="mt-1 flex min-w-[147px] items-center justify-center rounded-lg bg-[#622581] px-4 py-3 text-sm font-nunito font-semibold text-white transition-colors hover:bg-[#52206d]"
				>
					Add Store
				</Link>
			</div>

			<section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
				<div className="px-7 py-7">
					<h2 className="text-base font-poppins font-medium text-gray-800">
						Stores Details
					</h2>
				</div>

				<div className="overflow-hidden text-xs font-normal text-gray-800">
					<div className="grid h-11 grid-cols-[25%_18%_38%_19%] items-center bg-[#f3f3f3] text-left">
						<div className="px-3 whitespace-nowrap">Store Name</div>
						<div className="px-3 whitespace-nowrap">Code</div>
						<div className="px-3 whitespace-nowrap">Address</div>
						<div className="px-3 whitespace-nowrap text-center">Actions</div>
					</div>

					{stores.map((store) => (
						<div key={store.id} className="grid h-[50px] grid-cols-[25%_18%_38%_19%] items-center border-b border-[#e2e6eb]">
							<div className="flex items-center gap-3 px-3 whitespace-nowrap">
								<div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
									<Image src="/Images/image.png" alt="Store profile" fill className="object-cover" />
								</div>
								<span>{store.name}</span>
							</div>
							<div className="px-3 whitespace-nowrap">{store.code}</div>
							<div className="px-3 leading-4">{store.address}</div>
							<div className="px-3">
								<div className="flex items-center justify-center gap-3">
									<button type="button" onClick={() => handleEditClick(store)} className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50" aria-label={`Edit store ${store.name}`}>
										<Edit className="h-[18px] w-[18px]" />
									</button>
									<button type="button" onClick={() => { setSelectedStore(store); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50" aria-label={`Delete store ${store.name}`}>
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
							<h2 className="text-xl font-poppins font-medium text-gray-800">Edit Store</h2>
							<button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close edit store modal"><X className="h-5 w-5" /></button>
						</div>
						<form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<label className="text-sm font-normal text-gray-600">Store Name<input required value={editFormData.name} onChange={(event) => setEditFormData({ ...editFormData, name: event.target.value })} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#622581]" /></label>
							<label className="text-sm font-normal text-gray-600">Code<input required value={editFormData.code} onChange={(event) => setEditFormData({ ...editFormData, code: event.target.value })} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#622581]" /></label>
							<label className="text-sm font-normal text-gray-600 md:col-span-2">Address<textarea required rows={3} value={editFormData.address} onChange={(event) => setEditFormData({ ...editFormData, address: event.target.value })} className="mt-1.5 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#622581]" /></label>
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
