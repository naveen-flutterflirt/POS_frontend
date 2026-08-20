// app/dashboard/payment-details/page.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Edit, Trash2, X } from "lucide-react";

type Payment = {
	id: number;
	invoice: string;
	customer: string;
	phone: string;
	product: string;
	quantity: string;
	discount: string;
	cgst: string;
	sgst: string;
	paymentType: string;
	received: string;
};

const initialPayments: Payment[] = Array.from({ length: 5 }, (_, index) => ({
	id: index + 1,
	invoice: "1233434",
	customer: "M.Ram",
	phone: "9999999999",
	product: "Turmeric Powder",
	quantity: "01",
	discount: "10%",
	cgst: "2.5 %",
	sgst: "2.5 %",
	paymentType: "UPI",
	received: "1,450",
}));

export default function PaymentDetailsPage() {
	const [payments, setPayments] = useState(initialPayments);
	const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editFormData, setEditFormData] = useState<Payment>(initialPayments[0]);

	const handleEditClick = (payment: Payment) => {
		setSelectedPayment(payment);
		setEditFormData(payment);
		setIsEditModalOpen(true);
	};

	const handleEditSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setPayments((currentPayments) =>
			currentPayments.map((payment) =>
				payment.id === editFormData.id ? editFormData : payment
			)
		);
		setIsEditModalOpen(false);
		setSelectedPayment(null);
	};

	const handleDeleteClick = (payment: Payment) => {
		setSelectedPayment(payment);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (!selectedPayment) return;
		setPayments((currentPayments) =>
			currentPayments.filter((payment) => payment.id !== selectedPayment.id)
		);
		setIsDeleteModalOpen(false);
		setSelectedPayment(null);
	};

	const updateField = (field: keyof Payment, value: string) => {
		setEditFormData((currentData) => ({ ...currentData, [field]: value }));
	};

	return (
		<div className="h-full max-h-full space-y-6 overflow-hidden font-nunito">
			{/* Page Header */}
			<div className="flex items-start justify-between gap-6">
				<div>
					<h1 className="text-2xl font-poppins font-medium text-[#1f2d42]">
						Manage Payments of Customers &amp; Vendors
					</h1>
					<div className="flex items-center gap-2 text-sm font-nunito text-gray-500 mt-1">
						<span>Admin</span>
						<span className="text-lg text-gray-400">›</span>
						<span>Payment Details</span>
					</div>
				</div>

				<div className="flex items-center gap-4 mt-1">
					<span className="text-sm font-nunito text-gray-500 whitespace-nowrap">
						Customer/Vendor Payment Details
					</span>
					<button
						type="button"
						className="flex items-center justify-between gap-5 min-w-[146px] px-3 py-2.5 bg-[#622581] hover:bg-[#52206d] text-white rounded-lg text-xs font-nunito font-semibold transition-colors"
						aria-label="Select payment detail type"
					>
						Select
						<ChevronDown className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Payment Table */}
			<section className="h-[calc(100vh-190px)] min-h-0 overflow-hidden border border-gray-100 bg-white">
				<div className="px-7 py-6">
					<h2 className="text-base font-poppins font-medium text-[#1f2d42]">
						Customer Payment Details
					</h2>
				</div>

				<div className="overflow-hidden text-xs font-normal text-[#253247]">
					{/* Header Row - Percentage Based Grid */}
					<div className="grid h-11 grid-cols-[10.5%_10%_10%_13%_7%_7%_6%_6%_11%_12%_7.5%] items-center bg-[#f3f3f3] text-left">
						<div className="px-2 whitespace-nowrap">Invoice No.</div>
						<div className="px-2 whitespace-nowrap">Customer</div>
						<div className="px-2 whitespace-nowrap">Ph No</div>
						<div className="px-2 whitespace-nowrap">Product</div>
						<div className="px-2 whitespace-nowrap">Quantity</div>
						<div className="px-2 whitespace-nowrap">Discount</div>
						<div className="px-2 whitespace-nowrap">CGST</div>
						<div className="px-2 whitespace-nowrap">SGST</div>
						<div className="px-2 whitespace-nowrap">Payment Type</div>
						<div className="px-2 whitespace-nowrap">Payment Received</div>
						<div className="px-2 whitespace-nowrap text-center">Actions</div>
					</div>

					{/* Data Rows - Same Percentage Grid */}
					{payments.map((payment) => (
						<div
							key={payment.id}
							className="grid h-[50px] grid-cols-[10.5%_10%_10%_13%_7%_7%_6%_6%_11%_12%_7.5%] items-center border-b border-[#e2e6eb]"
						>
							<div className="px-2 whitespace-nowrap">{payment.invoice}</div>
							<div className="px-2 whitespace-nowrap">{payment.customer}</div>
							<div className="px-2 whitespace-nowrap">{payment.phone}</div>
							<div className="px-2 whitespace-nowrap">{payment.product}</div>
							<div className="px-2 whitespace-nowrap">{payment.quantity}</div>
							<div className="px-2 whitespace-nowrap">{payment.discount}</div>
							<div className="px-2 whitespace-nowrap">{payment.cgst}</div>
							<div className="px-2 whitespace-nowrap">{payment.sgst}</div>
							<div className="px-2 whitespace-nowrap">{payment.paymentType}</div>
							<div className="px-2 whitespace-nowrap">{payment.received}</div>
							<div className="px-2">
								<div className="flex items-center justify-center gap-2">
									<button
										type="button"
										onClick={() => handleEditClick(payment)}
										className="rounded p-1 text-[#1463ff] hover:bg-blue-50 transition-colors"
										aria-label={`Edit payment ${payment.invoice}`}
									>
										<Edit className="h-[18px] w-[18px]" />
									</button>
									<button
										type="button"
										onClick={() => handleDeleteClick(payment)}
										className="rounded p-1 text-[#ff0000] hover:bg-red-50 transition-colors"
										aria-label={`Delete payment ${payment.invoice}`}
									>
										<Trash2 className="h-[18px] w-[18px]" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Edit Modal */}
			{isEditModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
						<div className="mb-5 flex items-center justify-between">
							<h2 className="text-xl font-poppins font-medium text-[#1f2d42]">
								Edit Payment
							</h2>
							<button
								type="button"
								onClick={() => setIsEditModalOpen(false)}
								className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
								aria-label="Close edit payment modal"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<form
							onSubmit={handleEditSubmit}
							className="grid grid-cols-1 gap-4 md:grid-cols-2"
						>
							{([
								["invoice", "Invoice No."],
								["customer", "Customer"],
								["phone", "Ph No"],
								["product", "Product"],
								["quantity", "Quantity"],
								["discount", "Discount"],
								["cgst", "CGST"],
								["sgst", "SGST"],
								["paymentType", "Payment Type"],
								["received", "Payment Received"],
							] as [keyof Payment, string][]).map(([field, label]) => (
								<label key={field} className="text-sm font-normal text-gray-600">
									{label}
									<input
										value={editFormData[field]}
										onChange={(event) => updateField(field, event.target.value)}
										className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/20"
									/>
								</label>
							))}
							<button
								type="submit"
								className="md:col-span-2 mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white hover:bg-[#52206d]"
							>
								Update
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Delete Modal */}
			{isDeleteModalOpen && selectedPayment && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
						<h2 className="text-xl font-poppins font-medium text-[#1f2d42]">
							Delete Payment?
						</h2>
						<p className="mt-2 text-sm font-normal text-gray-500">
							Are you sure you want to delete invoice {selectedPayment.invoice}?
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
								onClick={handleDeleteConfirm}
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