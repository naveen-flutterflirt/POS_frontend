// app/dashboard/categories/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Edit, Save, ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categories, setCategories] = useState([
    { sno: "01", name: "Category name", code: "Category_Code" },
    { sno: "02", name: "Category name", code: "Category_Code" },
    { sno: "03", name: "Category name", code: "Category_Code" },
    { sno: "04", name: "Category name", code: "Category_Code" },
    { sno: "05", name: "Category name", code: "Category_Code" },
    { sno: "06", name: "Category name", code: "Category_Code" },
    { sno: "07", name: "Category name", code: "Category_Code" },
    { sno: "08", name: "Category name", code: "Category_Code" },
    { sno: "09", name: "Category name", code: "Category_Code" },
    { sno: "10", name: "Category name", code: "Category_Code" },
    { sno: "11", name: "Category name", code: "Category_Code" },
    { sno: "12", name: "Category name", code: "Category_Code" },
  ]);
  const [editFormData, setEditFormData] = useState({ name: "", code: "" });
  const [createFormData, setCreateFormData] = useState({ name: "", code: "" });
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  
  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Create category handler
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory = {
      sno: String(categories.length + 1).padStart(2, "0"),
      name: createFormData.name,
      code: createFormData.code,
    };
    setCategories([...categories, newCategory]);
    setCreateFormData({ name: "", code: "" });
    setIsModalOpen(false);
  };

  // Edit category handler
  const handleEditClick = (category: any) => {
    setSelectedCategory(category);
    setEditFormData({ name: category.name, code: category.code });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCategories = categories.map((cat) =>
      cat.sno === selectedCategory.sno
        ? { ...cat, name: editFormData.name, code: editFormData.code }
        : cat
    );
    setCategories(updatedCategories);
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  // Delete category handler
  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    const filteredCategories = categories.filter(
      (cat) => cat.sno !== selectedCategory.sno
    );
    // Update sno numbers
    const updatedCategories = filteredCategories.map((cat, index) => ({
      ...cat,
      sno: String(index + 1).padStart(2, "0"),
    }));
    setCategories(updatedCategories);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
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
            Manage Categories
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
            <span className="text-[#622581] font-medium">Categories</span>
          </div>
        </div>
        
        {/* Create Category Button - Top Right */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#622581] hover:bg-[#622581]/90 text-white font-nunito font-medium text-sm rounded-lg transition duration-200 cursor-pointer whitespace-nowrap shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </button>
      </div>

      {/* Category Master Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-poppins font-medium text-gray-800">
            Category Master Details
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
                  Name
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
              {currentCategories.map((category) => (
                <tr key={category.sno} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">
                    {category.sno}
                  </td>
                  <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">
                    {category.code}
                  </td>
                  <td className="px-6 py-4 text-sm font-nunito text-gray-700">
                    <div className="flex items-center gap-2">
                      {/* Edit Icon */}
                      <button 
                        onClick={() => handleEditClick(category)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* Delete Icon */}
                      <button 
                        onClick={() => handleDeleteClick(category)}
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, categories.length)} of {categories.length} entries
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

      {/* Create Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">
                Create Category
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCategory} className="space-y-5">
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Category"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
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

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">
                Edit Category
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
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Category"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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
                Delete Category
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
                Do you really want to delete <strong>"{selectedCategory?.name}"</strong>? This action cannot be undone.
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