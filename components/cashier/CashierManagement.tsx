"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, X } from "lucide-react";

type Cashier = {
	id: number;
	name: string;
	email: string;
	password: string;
	mobile: string;
	store: string;
};

const initialCashiers: Cashier[] = Array.from({ length: 5 }, (_, index) => ({
	id: index + 1,
	name: "S. Madhavan",
	email: "madhuvan@gmail.com",
	password: "maddy123",
	mobile: "+91 9686863356",
	store: "Madhuvana Spices",
}));

const emptyCashier: Cashier = {
	id: 0,
	name: "",
	email: "",
	password: "",
	mobile: "",
	store: "",
};

export default function CashierManagement() {
	const [cashiers, setCashiers] = useState<Cashier[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
		setIsLoading(true);
		fetch(`${apiUrl}/users`)
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					const mapped: Cashier[] = data.map((u: any) => ({
						id: u.id,
						name: u.name,
						email: u.email,
						password: u.password || "********",
						mobile: u.mobileNumber || "",
						store: "Madhuvana Spices",
					}));
					setCashiers(mapped);
				}
			})
			.catch(console.error)
			.finally(() => setIsLoading(false));
	}, []);
	const [formData, setFormData] = useState(emptyCashier);
	const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const openEditModal = (cashier: Cashier) => {
		setSelectedCashier(cashier);
		setFormData(cashier);
		setIsEditModalOpen(true);
	};

	const handleEdit = (event: React.FormEvent) => {
		event.preventDefault();
		setCashiers((currentCashiers) =>
			currentCashiers.map((cashier) =>
				cashier.id === formData.id ? formData : cashier,
			),
		);
		setIsEditModalOpen(false);
		setSelectedCashier(null);
	};

	const handleDelete = () => {
		if (!selectedCashier) return;
		setCashiers((currentCashiers) =>
			currentCashiers.filter((cashier) => cashier.id !== selectedCashier.id),
		);
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
				<div className="px-5 py-4 sm:px-7">
					<h2 className="font-poppins text-base font-medium text-gray-800">
						Cashiers Login Details
					</h2>
				</div>
				<div className="scrollbar-none overflow-x-auto">
					<table className="w-full min-w-[600px] border-collapse font-nunito text-sm">
						<thead>
							<tr className="border-y border-gray-200 bg-gray-50">
								{["Name", "Email", "Password", "Mobile Number", "Store", "Actions"].map((col) => (
									<th key={col} className="whitespace-nowrap px-4 py-3 text-left font-nunito text-sm font-normal text-gray-600 first:pl-7 last:pr-7">
										{col}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{isLoading ? (
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
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{cashier.password}</td>
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{cashier.mobile}</td>
										<td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{cashier.store}</td>
										<td className="whitespace-nowrap px-4 py-3 pr-7">
											<div className="flex items-center gap-3">
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
										value={formData[field]}
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
		</div>
	);
}
