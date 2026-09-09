"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

type LoyaltyProgram = {
  id: number;
  programId: string;
  name: string;
  type: string;
  redemptionRule: string;
  status: "Active" | "Inactive";
  startDate: string;
  endDate: string;
};

const initialPrograms: LoyaltyProgram[] = [
  { id: 1, programId: "1233434", name: "Rewards", type: "Points", redemptionRule: "100 pts = ₹50 discount", status: "Active", startDate: "01/12/2026", endDate: "12/12/2026" },
  { id: 2, programId: "5895855", name: "Cashback Bonus", type: "Cashback", redemptionRule: "5% cashback on bill", status: "Inactive", startDate: "01/12/2026", endDate: "12/12/2026" },
  { id: 3, programId: "1233434", name: "Rewards", type: "Points", redemptionRule: "100 pts = ₹50 discount", status: "Active", startDate: "01/12/2026", endDate: "12/12/2026" },
];

export default function AdminLoyaltyPrograms() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [selectedProgram, setSelectedProgram] = useState<LoyaltyProgram | null>(null);
  const [editFormData, setEditFormData] = useState<LoyaltyProgram>(initialPrograms[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (program: LoyaltyProgram) => {
    setSelectedProgram(program);
    setEditFormData(program);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPrograms((currentPrograms) => currentPrograms.map((program) => program.id === editFormData.id ? editFormData : program));
    setIsEditModalOpen(false);
    setSelectedProgram(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProgram) return;
    setPrograms((currentPrograms) => currentPrograms.filter((program) => program.id !== selectedProgram.id));
    setIsDeleteModalOpen(false);
    setSelectedProgram(null);
  };

  const updateField = (field: keyof LoyaltyProgram, value: string) => {
    setEditFormData((currentData) => ({ ...currentData, [field]: value } as LoyaltyProgram));
  };

  return (
    <div className="space-y-4 font-nunito">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">Customer Management</h1>
          <div className="mt-1 flex items-center gap-2 text-sm font-nunito text-gray-500"><span>Admin</span><span className="text-lg text-gray-400">›</span><span>Customer Management</span><span className="text-lg text-gray-400">›</span><span className="text-gray-800">Loyalty Programs</span></div>
        </div>
        <Link href="/admin/dashboard/loyalty-programs/create" className="mt-1 flex items-center justify-center rounded-lg bg-[#622581] px-4 py-3 text-sm font-nunito font-semibold text-white transition-colors hover:bg-[#52206d]">Add Loyalty Programs</Link>
      </div>

      <div className="bg-white">
        <div className="px-7 py-7"><h2 className="text-base font-poppins font-medium text-gray-800">Loyalty Programs Details</h2></div>
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse font-nunito text-sm">
            <thead>
              <tr className="bg-[#f3f3f3] text-xs font-normal text-gray-800">
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Program Name</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Category</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Membership Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Points Per Unit</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Redemption Rate</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Min Order Value</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-normal">Max Discount</th>
                <th className="whitespace-nowrap px-4 py-3 text-center font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programs.map((program) => (
                <tr key={program.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{program.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{program.type}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{program.programId}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{program.redemptionRule}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{program.startDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">{program.endDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
                    <span className={`inline-flex rounded px-3 py-1 text-[11px] text-white ${program.status === "Active" ? "bg-[#55b566]" : "bg-[#e49a49]"}`}>{program.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-nunito text-gray-700">
                    <div className="flex items-center justify-center gap-3">
                      <button type="button" onClick={() => handleEditClick(program)} className="rounded p-1 text-[#1463ff] hover:bg-blue-50" aria-label={`Edit ${program.name}`}><Edit className="h-[18px] w-[18px]" /></button>
                      <button type="button" onClick={() => { setSelectedProgram(program); setIsDeleteModalOpen(true); }} className="rounded p-1 text-[#ff0000] hover:bg-red-50" aria-label={`Delete ${program.name}`}><Trash2 className="h-[18px] w-[18px]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-poppins font-medium text-gray-800">Edit Loyalty Program</h2><button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close edit modal"><X className="h-5 w-5" /></button></div><form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">{([["programId", "Program Id"], ["name", "Program Name"], ["type", "Type"], ["redemptionRule", "Redemption Rule"], ["status", "Status"], ["startDate", "Start Date"], ["endDate", "End Date"]] as [keyof LoyaltyProgram, string][]).map(([field, label]) => <label key={field} className="text-sm font-normal text-gray-600">{label}<input required value={editFormData[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#622581]" /></label>)}<button type="submit" className="mt-2 rounded-lg bg-[#622581] py-2.5 font-poppins text-sm font-medium text-white md:col-span-2">Update</button></form></div></div>}
      {isDeleteModalOpen && selectedProgram && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"><h2 className="text-xl font-poppins font-medium text-gray-800">Delete Loyalty Program?</h2><p className="mt-2 text-sm text-gray-500">Are you sure you want to delete {selectedProgram.name}?</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-600">Cancel</button><button type="button" onClick={handleDeleteConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white">Delete</button></div></div></div>}
    </div>
  );
}
