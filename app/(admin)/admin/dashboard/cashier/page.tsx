"use client";

import { useState } from "react";
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

export default function CashierPage() {
	const [cashiers, setCashiers] = useState(initialCashiers);
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
		<div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
			<div className="flex items-start justify-between gap-6">
				<div>
					<h1 className="text-2xl font-poppins font-medium text-gray-800">
						Manage Cashiers
					</h1>
					<div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500">
						<span>Admin</span>
						<span className="text-lg text-gray-400">›</span>
						<span className="text-gray-800">Cashier Management</span>
					</div>
				</div>

				<Link
					href="/admin/dashboard/cashier/create"
					className="mt-1 flex min-w-[159px] items-center justify-center gap-2 rounded-lg bg-[#622581] px-4 py-3 text-sm font-nunito font-semibold text-white transition-colors hover:bg-[#52206d]"
				>
					Create Cashier
				</Link>
			</div>

			<section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
				<div className="px-7 py-7">
					<h2 className="text-base font-poppins font-medium text-gray-800">
						Cashiers Login Details
					</h2>
				</div>

				<div className="overflow-hidden text-xs font-normal text-gray-800">
					<div className="grid h-12 grid-cols-[17%_17%_17%_17%_17%_15%] items-center bg-[#f3f3f3] text-left">
						<div className="px-3 whitespace-nowrap">Name</div>
						<div className="px-3 whitespace-nowrap">Email</div>
						<div className="px-3 whitespace-nowrap">Password</div>
						<div className="px-3 whitespace-nowrap">Mobile Number</div>
						<div className="px-3 whitespace-nowrap">Store</div>
						<div className="px-3 whitespace-nowrap text-center">Actions</div>
					</div>

					{cashiers.map((cashier) => (
						<div
							key={cashier.id}
							className="grid h-[55px] grid-cols-[17%_17%_17%_17%_17%_15%] items-center border-b border-[#e2e6eb]"
						>
							<div className="px-3 whitespace-nowrap">{cashier.name}</div>
							<div className="px-3 whitespace-nowrap">{cashier.email}</div>
							<div className="px-3 whitespace-nowrap">{cashier.password}</div>
							<div className="px-3 whitespace-nowrap">{cashier.mobile}</div>
							<div className="px-3 whitespace-nowrap">{cashier.store}</div>
							<div className="px-3">
								<div className="flex items-center justify-center gap-3">
									<button
										type="button"
										onClick={() => openEditModal(cashier)}
										className="rounded p-1 text-[#1463ff] transition-colors hover:bg-blue-50"
										aria-label={`Edit cashier ${cashier.name}`}
									>
										<Edit className="h-[18px] w-[18px]" />
									</button>
									<button
										type="button"
										onClick={() => {
											setSelectedCashier(cashier);
											setIsDeleteModalOpen(true);
										}}
										className="rounded p-1 text-[#ff0000] transition-colors hover:bg-red-50"
										aria-label={`Delete cashier ${cashier.name}`}
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
