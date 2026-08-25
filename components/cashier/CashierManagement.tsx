"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import { useApi } from "@/context/ApiContext";
import { Edit, Eye, EyeOff, Trash2, X, Plus, Search } from "lucide-react";

type Cashier = {
	id: number;
	name: string;
	email: string;
	password: string;
	mobile: string;
	store: string;
	posAccess: boolean;
};

const initialCashiers: Cashier[] = Array.from({ length: 5 }, (_, index) => ({
	id: index + 1,
	name: "S. Madhavan",
	email: "madhuvan@gmail.com",
	password: "maddy123",
	mobile: "+91 9686863356",
	store: "Madhuvana Spices",
	posAccess: false,
}));

const emptyCashier: Cashier = {
	id: 0,
	name: "",
	email: "",
	password: "",
	mobile: "",
	store: "",
	posAccess: false,
};

export default function CashierManagement() {
	const { put } = useApi();
	const { data: rawUsers, isLoading, isRefreshing } = useCachedFetch<any[]>(
		"/users?role=CASHIER",
		{ cacheKey: "cache:users:cashier", staleTtl: 30_000 }
	);

	console.log("🔥 RAW USERS:", rawUsers);
	console.log("🔥 LOADING:", isLoading);
	console.log("🔥 REFRESHING:", isRefreshing);

	// Derived synchronously — no render delay (useMemo instead of useEffect)
	const apiCashiers = useMemo<Cashier[]>(() => {
		console.log("🟡 RAW USERS INSIDE MEMO:", rawUsers);

		if (!Array.isArray(rawUsers)) {
			console.log("❌ rawUsers is NOT an array");
			return [];
		}

		const mapped = rawUsers.map((u: any) => ({
			id: u.id,
			name: u.name ?? "",
			email: u.email ?? "",
			password: u.password || "********",
			mobile: u.mobileNumber ?? "",
			store: "Madhuvana Spices",
			posAccess: u.posAccess ?? false,
		}));

		console.log("🟢 API CASHIERS:", mapped);

		return mapped;
	}, [rawUsers]);

	// Local overrides for optimistic edit/delete (merge with api data)
	const [localOverrides, setLocalOverrides] = useState<Record<number, Cashier | null>>({});
	const cashiers = useMemo<Cashier[]>(() => {
		const result = apiCashiers
			.filter((c) => localOverrides[c.id] !== null)
			.map((c) => localOverrides[c.id] ?? c);

		console.log("🔵 FINAL CASHIERS:", result);

		return result;
	}, [apiCashiers, localOverrides]);
	const [formData, setFormData] = useState(emptyCashier);
	const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleToggleAccess = async (e: React.MouseEvent, cashier: Cashier) => {
		e.stopPropagation();
		const newStatus = !cashier.posAccess;
		setLocalOverrides(prev => ({ ...prev, [cashier.id]: { ...cashier, posAccess: newStatus } }));
		
		try {
			await put(`/users/${cashier.id}`, { posAccess: newStatus });
		} catch (error) {
			console.error("Failed to update access:", error);
			// Revert on error
			setLocalOverrides(prev => ({ ...prev, [cashier.id]: cashier }));
		}
	};

	const handleRowClick = (cashier: Cashier) => {
		setSelectedCashier(cashier);
		setShowPassword(false);
		setIsViewModalOpen(true);
	};

	const openEditModal = (cashier: Cashier) => {
		setSelectedCashier(cashier);
		setFormData(cashier);
		setIsEditModalOpen(true);
	};

	const handleEdit = (event: React.FormEvent) => {
		event.preventDefault();
		setLocalOverrides(prev => ({ ...prev, [formData.id]: formData }));
		setIsEditModalOpen(false);
		setSelectedCashier(null);
	};

	const handleDelete = () => {
		if (!selectedCashier) return;
		setLocalOverrides(prev => ({ ...prev, [selectedCashier.id]: null }));
		setIsDeleteModalOpen(false);
		setSelectedCashier(null);
	};

	const updateField = (field: keyof Cashier, value: string) => {
		setFormData((currentData) => ({ ...currentData, [field]: value }));
	};

	const closeFormModal = () => {
		setIsEditModalOpen(false);
		setSelectedCashier(null);
	};

	return (
		<div className="space-y-4 font-nunito">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h1 className="font-poppins text-xl font-medium text-gray-800 sm:text-2xl">
						Manage Cashiers
					</h1>
					<div className="mt-1 flex items-center gap-2 font-nunito text-sm text-gray-500">
						<span>Admin</span>
						<span className="text-lg text-gray-400">›</span>
						<span className="text-gray-800">Cashier Management</span>
					</div>
				</div>
				<Link
					href="/admin/dashboard/cashier/create"
					className="flex items-center justify-center gap-2 rounded-lg bg-[#622581] px-4 py-2.5 font-nunito text-sm font-semibold text-white transition-colors hover:bg-[#52206d]"
				>
					Create Cashier
				</Link>
			</div>

			<div className="bg-white">
				<div className="px-5 py-4 sm:px-7 flex items-center gap-3">
					<h2 className="font-poppins text-base font-medium text-gray-800">
						Cashiers Login Details
					</h2>
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
									<th key={col} className="whitespace-nowrap px-4 py-3 text-left font-nunito text-sm font-normal text-gray-600 first:pl-7 last:pr-7">
										{col}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{cashiers.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-12 text-center">
										<div className="flex flex-col items-center gap-3">
											<div className="h-8 w-8 animate-spin rounded-full border-4 border-[#622581] border-t-transparent" />
											<span className="font-nunito text-sm text-gray-500">Loading cashiers...</span>
										</div>
									</td>
								</tr>
							) : cashiers.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-12 text-center font-nunito text-sm text-gray-400">
										No cashiers found. Create one to get started.
									</td>
								</tr>
							) : (
								cashiers.map((cashier) => (
									<tr key={cashier.id} className="transition-colors hover:bg-gray-50">
										<td className="whitespace-nowrap px-4 py-3 pl-7 font-nunito text-gray-700">{cashier.name}</td>
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{cashier.email}</td>
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{cashier.mobile}</td>
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{cashier.store}</td>
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700" onClick={(e) => e.stopPropagation()}>
											<button
												onClick={(e) => handleToggleAccess(e, cashier)}
												className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${cashier.posAccess ? 'bg-[#622581]' : 'bg-gray-200'}`}
											>
												<span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${cashier.posAccess ? 'translate-x-4' : 'translate-x-1'}`} />
											</button>
										</td>
										<td className="whitespace-nowrap px-4 py-3 pr-7">
											<div className="flex items-center gap-3">
												<button type="button" onClick={() => handleRowClick(cashier)} className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100" aria-label={`View details for ${cashier.name}`}>
													<Eye className="h-[18px] w-[18px]" />
												</button>
												<button type="button" onClick={() => openEditModal(cashier)} className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50" aria-label={`Edit cashier ${cashier.name}`}>
													<Edit className="h-[18px] w-[18px]" />
												</button>
												<button type="button" onClick={() => { setSelectedCashier(cashier); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50" aria-label={`Delete cashier ${cashier.name}`}>
													<Trash2 className="h-[18px] w-[18px]" />
												</button>
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
							<h2 className="text-xl font-poppins font-medium text-gray-800">
								Edit Cashier
							</h2>
							<button
								type="button"
								onClick={closeFormModal}
								className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
								aria-label="Close cashier modal"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<form
							onSubmit={handleEdit}
							className="grid grid-cols-1 gap-4 md:grid-cols-2"
						>
							{([
								["name", "Name", "Enter Name"],
								["email", "Email", "Enter Email"],
								["password", "Password", "Enter Password"],
								["mobile", "Mobile Number", "Enter Mobile Number"],
								["store", "Store", "Enter Store"],
							] as [keyof Cashier, string, string][]).map(([field, label, placeholder]) => (
								<label key={field} className="text-sm font-normal text-gray-600">
									{label}
									<input
										required
										type={field === "password" ? "password" : "text"}
										value={formData[field] as string}
										placeholder={placeholder}
										onChange={(event) => updateField(field, event.target.value)}
										className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-normal text-gray-700 outline-none transition focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
									/>
								</label>
							))}
							<button
								type="submit"
								className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d] md:col-span-2"
							>
								Update
							</button>
						</form>
					</div>
				</div>
			)}

			{isDeleteModalOpen && selectedCashier && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
						<h2 className="text-xl font-poppins font-medium text-gray-800">
							Delete Cashier?
						</h2>
						<p className="mt-2 text-sm font-normal text-gray-500">
							Are you sure you want to delete {selectedCashier.name}?
						</p>
						<div className="mt-6 flex justify-center gap-3">
							<button
								type="button"
								onClick={() => setIsDeleteModalOpen(false)}
								className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-normal text-gray-600 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleDelete}
								className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{/* View Details Modal */}
			{isViewModalOpen && selectedCashier && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsViewModalOpen(false)}>
					<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-2xl font-poppins font-medium text-gray-800">Cashier Details</h2>
							<button onClick={() => setIsViewModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 transition-colors">
								<X className="h-5 w-5" />
							</button>
						</div>
						
						<div className="space-y-4">
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">Name</p>
								<p className="text-sm font-nunito font-medium text-gray-800">{selectedCashier.name}</p>
							</div>
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">Email</p>
								<p className="text-sm font-nunito font-medium text-gray-800">{selectedCashier.email}</p>
							</div>
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">Mobile</p>
								<p className="text-sm font-nunito font-medium text-gray-800">{selectedCashier.mobile}</p>
							</div>
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">Store</p>
								<p className="text-sm font-nunito font-medium text-gray-800">{selectedCashier.store}</p>
							</div>
							<div>
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-1">POS Access</p>
								<span className={`inline-block mt-1 px-2.5 py-1 text-xs font-nunito font-semibold rounded-md ${selectedCashier.posAccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
									{selectedCashier.posAccess ? "Granted" : "Revoked"}
								</span>
							</div>
							<div className="pt-2 border-t border-gray-100">
								<p className="text-xs font-nunito text-gray-500 uppercase tracking-wider mb-2">Security</p>
								<div className="flex items-center gap-3 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200">
									<p className="text-sm font-nunito font-medium text-gray-800 tracking-widest flex-1">
										{showPassword ? selectedCashier.password : "••••••••"}
									</p>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
										title={showPassword ? "Hide Password" : "Show Password"}
									>
										{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
