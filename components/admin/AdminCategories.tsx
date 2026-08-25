"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Edit, ChevronLeft, ChevronRight, X, Trash2, Loader2, Layers } from "lucide-react";
import { useApi } from "@/context/ApiContext";

interface Category {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: any[];
}

export default function AdminCategories() {
  const { get, post, put, del } = useApi();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [createFormData, setCreateFormData] = useState({ name: "", code: "" });
  const [editFormData, setEditFormData] = useState({ name: "", code: "" });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await get<Category[]>("/catalog/categories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [get]);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await post("/catalog/categories", {
        name: createFormData.name,
        code: createFormData.code,
      });
      await fetchCategories();
      setCreateFormData({ name: "", code: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditFormData({ name: category.name, code: category.code });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      setIsSubmitting(true);
      await put(`/catalog/categories/${selectedCategory.id}`, {
        name: editFormData.name,
        code: editFormData.code,
      });
      await fetchCategories();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    try {
      setIsSubmitting(true);
      await del(`/catalog/categories/${selectedCategory.id}`);
      await fetchCategories();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete. It might be linked to existing products.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">Manage Categories</h1>
          <div className="flex items-center gap-2 text-sm font-nunito font-normal text-gray-500 mt-1">
            <Link href="/admin/dashboard" className="hover:text-[#622581] transition-colors duration-200">Admin</Link>
            <span>&gt;</span>
            <span className="text-[#622581] font-medium">Category Management</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#622581] hover:bg-[#622581]/90 text-white font-nunito font-medium text-sm rounded-lg transition duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-poppins font-medium text-gray-800">Category Master Details</h2>
        </div>

        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">Sub-Categories</th>
                <th className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-nunito">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#622581]" />
                    Loading categories...
                  </td>
                </tr>
              ) : currentCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-nunito">
                    No categories found. Create one to get started.
                  </td>
                </tr>
              ) : (
                currentCategories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">{indexOfFirstItem + index + 1}</td>
                    <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">{category.name}</td>
                    <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">{category.code}</td>
                    <td className="px-6 py-4 text-sm font-nunito font-normal text-gray-700">
                      <span className="bg-[#622581]/10 text-[#622581] px-2.5 py-0.5 rounded-full font-medium">
                        {category.subcategories?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-nunito text-gray-700">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(category)} className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <Link href={`/admin/dashboard/sub-categories?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`} className="p-1.5 text-[#622581] hover:text-[#4a1c62] hover:bg-purple-50 rounded transition-colors duration-200" title="View Sub-categories">
                          <Layers className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDeleteClick(category)} className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && categories.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-nunito font-normal text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, categories.length)} of {categories.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-gray-500 hover:text-[#622581] hover:bg-[#622581]/10 rounded-lg transition duration-200 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-sm text-gray-400">...</span>
                  ) : (
                    <button key={page} onClick={() => goToPage(page as number)} className={`w-8 h-8 text-sm font-nunito font-normal rounded-lg transition duration-200 ${currentPage === page ? "bg-[#622581] text-white" : "text-gray-600 hover:bg-[#622581]/10"}`}>
                      {page}
                    </button>
                  )
                ))}
              </div>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-gray-500 hover:text-[#622581] hover:bg-[#622581]/10 rounded-lg transition duration-200 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">Create Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-5">
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">Category Name</label>
                <input type="text" placeholder="Enter Category" value={createFormData.name} onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition" required />
              </div>
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">Code</label>
                <input type="text" placeholder="Enter Code" value={createFormData.code} onChange={(e) => setCreateFormData({ ...createFormData, code: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition" required />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#622581] hover:bg-[#622581]/90 disabled:bg-gray-400 text-white font-poppins font-medium py-2.5 rounded-lg flex justify-center items-center gap-2 transition duration-200 mt-4">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">Edit Category</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">Category Name</label>
                <input type="text" placeholder="Enter Category" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition" required />
              </div>
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1">Code</label>
                <input type="text" placeholder="Enter Code" value={editFormData.code} onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition" required />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#622581] hover:bg-[#622581]/90 disabled:bg-gray-400 text-white font-poppins font-medium py-2.5 rounded-lg flex justify-center items-center gap-2 transition duration-200 mt-4">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">Delete Category</h2>
              <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-poppins font-medium text-gray-800 mb-2">Are you sure?</h3>
              <p className="text-sm font-nunito font-normal text-gray-600 mb-6">
                Do you really want to delete <strong>"{selectedCategory?.name}"</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button disabled={isSubmitting} onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-nunito rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button disabled={isSubmitting} onClick={handleDeleteConfirm} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-nunito flex justify-center items-center gap-2 rounded-lg transition">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
