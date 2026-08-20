// app/dashboard/sub-categories/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Edit, Save, ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";

export default function SubCategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [subCategories, setSubCategories] = useState([
    { sno: "01", name: "Sub-category Name", category: "Category Name", code: "Code" },
    { sno: "02", name: "Sub-category Name", category: "Category Name", code: "Code" },
    { sno: "03", name: "Sub-category Name", category: "Category Name", code: "Code" },
    { sno: "04", name: "Sub-category Name", category: "Category Name", code: "Code" },
    { sno: "05", name: "Sub-category Name", category: "Category Name", code: "Code" },
  ]);
  const [editFormData, setEditFormData] = useState({ name: "", category: "", code: "" });
  const [createFormData, setCreateFormData] = useState({ name: "", category: "", code: "" });
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);
  
  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubCategories = subCategories.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Create sub-category handler
  const handleCreateSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubCategory = {
      sno: String(subCategories.length + 1).padStart(2, "0"),
      name: createFormData.name,
      category: createFormData.category,
      code: createFormData.code,
    };
    setSubCategories([...subCategories, newSubCategory]);
    setCreateFormData({ name: "", category: "", code: "" });
    setIsModalOpen(false);
  };

  // Edit sub-category handler
  const handleEditClick = (subCategory: any) => {
    setSelectedSubCategory(subCategory);
    setEditFormData({ 
      name: subCategory.name, 
      category: subCategory.category,
      code: subCategory.code 
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSubCategories = subCategories.map((cat) =>
      cat.sno === selectedSubCategory.sno
        ? { ...cat, name: editFormData.name, category: editFormData.category, code: editFormData.code }
        : cat
    );
    setSubCategories(updatedSubCategories);
    setIsEditModalOpen(false);
    setSelectedSubCategory(null);
  };

  // Delete sub-category handler
  const handleDeleteClick = (subCategory: any) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    const filteredSubCategories = subCategories.filter(
      (cat) => cat.sno !== selectedSubCategory.sno
    );
    const updatedSubCategories = filteredSubCategories.map((cat, index) => ({
      ...cat,
      sno: String(index + 1).padStart(2, "0"),
    }));
    setSubCategories(updatedSubCategories);
    setIsDeleteModalOpen(false);
    setSelectedSubCategory(null);
  };

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">
            Manage Sub-Categories
          </h1>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm font-nunito font-normal text-gray-500 mt-1">
            <Link 
              href="/dashboard" 
              className="hover:text-[#622581] transition-colors duration-200 cursor-pointer"
            >
              Admin
            </Link>
            <span>&gt;</span>
            <Link 
              href="/dashboard/categories" 
              className="hover:text-[#622581] transition-colors duration-200 cursor-pointer"
            >
              Category Management
            </Link>
            <span>&gt;</span>
            <span className="text-[#622581] font-medium">Sub-Categories</span>
          </div>
        </div>
        
        {/* Create Sub-Category Button - Top Right */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#622581] hover:bg-[#622581]/90 text-white font-nunito font-medium text-sm rounded-lg transition duration-200 cursor-pointer whitespace-nowrap shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Sub-Category
        </button>
      </div>

      {/* Sub-Category Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-poppins font-medium text-gray-800">
            Sub-Category Details
          </h2>
        </div>

        {/* Table */}
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  S.NO
                </th>
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Sub-category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentSubCategories.map((subCategory) => (
                <tr key={subCategory.sno} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">
                    {subCategory.sno}
                  </td>
                  <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">
                    {subCategory.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">
                    {subCategory.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">
                    {subCategory.code}
                  </td>
                  <td className="px-6 py-4 text-sm font-nunito text-gray-700">
                    <div className="flex items-center gap-2">
                      {/* Edit Icon */}
                      <button 
                        onClick={() => handleEditClick(subCategory)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* Delete Icon */}
                      <button 
                        onClick={() => handleDeleteClick(subCategory)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-nunito font-normal text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, subCategories.length)} of {subCategories.length} entries
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-[#622581] hover:bg-[#622581]/10 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-sm font-nunito font-normal text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`w-8 h-8 text-sm font-nunito font-normal rounded-lg transition duration-200 cursor-pointer ${
                      currentPage === page
                        ? "bg-[#622581] text-white"
                        : "text-gray-600 hover:bg-[#622581]/10 hover:text-[#622581]"
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-[#622581] hover:bg-[#622581]/10 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Sub-Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">
                Create Sub-Category
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubCategory} className="space-y-5">
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">
                  Sub-category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Sub-category Name"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Category Name"
                  value={createFormData.category}
                  onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  placeholder="Enter Code"
                  value={createFormData.code}
                  onChange={(e) => setCreateFormData({ ...createFormData, code: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#622581] hover:bg-[#622581]/90 text-white font-poppins font-medium py-2.5 rounded-lg transition duration-200 mt-4"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sub-Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">
                Edit Sub-Category
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">
                  Sub-category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Sub-category Name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Category Name"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  placeholder="Enter Code"
                  value={editFormData.code}
                  onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#622581] hover:bg-[#622581]/90 text-white font-poppins font-medium py-2.5 rounded-lg transition duration-200 mt-4"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">
                Delete Sub-Category
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confirmation Message */}
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-poppins font-medium text-gray-800 mb-2">
                Are you sure?
              </h3>
              <p className="text-sm font-nunito font-normal text-gray-600 mb-6">
                Do you really want to delete <strong>"{selectedSubCategory?.name}"</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-nunito font-medium rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-nunito font-medium rounded-lg transition duration-200 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}