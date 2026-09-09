"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useApi } from "@/context/ApiContext";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";

export default function AdminProductManagement() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { get, put, del } = useApi();

  // Load products list on mount
  useEffect(() => {
    setIsLoading(true);
    get("/catalog/products")
      .then((data: any) => {
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.imageUrl || "/Images/image.png", // Fallback placeholder image asset
            code: p.code,
            uom: p.uom,
            hsnCode: p.hsnCode,
            description: p.description || "",
            category: p.category?.name || "Category",
            categoryId: p.categoryId,
            subCategory: p.subcategory?.name || p.subcategoryId,
            subcategoryId: p.subcategoryId,
          }));
          setProducts(mapped);
        }
      })
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setIsLoading(false));
      
    get("/catalog/categories")
      .then((data: any) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, [get]);

  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    uom: "",
    hsnCode: "",
    description: "",
    category: "",
    subCategory: "",
  });

  // View handler
  const handleViewClick = (product: any) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  // Delete handler
  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await del(`/catalog/products/${selectedProduct.id}`);
      const filteredProducts = products.filter((p) => p.id !== selectedProduct.id);
      setProducts(filteredProducts);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit handler
  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      code: product.code,
      uom: product.uom,
      hsnCode: product.hsnCode,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await put(`/catalog/products/${selectedProduct.id}`, editFormData);
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, ...editFormData }
          : p
      );
      setProducts(updatedProducts);
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryId ? p.categoryId?.toString() === selectedCategoryId : true;
    const matchesSubcategory = selectedSubcategoryId ? p.subcategoryId?.toString() === selectedSubcategoryId : true;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Create Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">
            Manage Products
          </h1>
          <div className="flex items-center gap-2 text-sm font-nunito font-normal text-gray-500 mt-1">
            <Link
              href="/admin/dashboard"
              className="hover:text-[#622581] transition-colors duration-200 cursor-pointer"
            >
              Admin
            </Link>
            <span>&gt;</span>
            <span className="text-[#622581] font-medium">Product Management</span>
          </div>
        </div>

        {/* Create Product Button - Routes to /create */}
        <button
          onClick={() => router.push('/admin/dashboard/product-management/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#622581] hover:bg-[#622581]/90 text-white font-nunito font-medium text-sm rounded-lg transition duration-200 cursor-pointer whitespace-nowrap shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Product
        </button>
      </div>

      {/* Product Master Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h2 className="text-lg font-poppins font-medium text-gray-800 whitespace-nowrap">
            Product Master Details
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-nunito focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none"
            />
            <select
              value={selectedCategoryId}
              onChange={(e) => { setSelectedCategoryId(e.target.value); setSelectedSubcategoryId(""); }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-nunito focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={selectedSubcategoryId}
              onChange={(e) => setSelectedSubcategoryId(e.target.value)}
              disabled={!selectedCategoryId}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-nunito focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">All Sub-Categories</option>
              {categories.find(c => c.id.toString() === selectedCategoryId)?.subcategories?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table - No Horizontal Scroll */}
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[800px] table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  UOM
                </th>
                <th className="px-4 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  HSN_Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Sub-Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-nunito font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#622581] border-t-transparent" />
                      <span className="font-nunito text-sm text-gray-500">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center font-nunito text-sm text-gray-400">
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Product Name with Image */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                      {product.code}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                      {product.uom}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                      {product.hsnCode}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 max-w-[150px] truncate" title={product.description}>
                      {product.description?.length > 30 ? product.description.substring(0, 30) + "..." : (product.description || "—")}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                      {product.subCategory}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito text-gray-700">
                      <div className="flex items-center gap-1.5">
                        {/* View Icon */}
                        <button
                          onClick={() => handleViewClick(product)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Edit Icon */}
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-1.5 text-[#1463ff] hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200 cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* Delete Icon */}
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200 cursor-pointer"
                          title="Delete"
                        >
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

        {/* Footer with Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-nunito font-normal text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-[#622581] hover:bg-[#622581]/10 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-8 h-8 flex items-center justify-center text-sm font-nunito font-normal text-gray-400"
                  >
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
              )}
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

      {/* View Product Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsViewModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">
                Product Details
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-8 mb-8 pb-8 border-b border-gray-100">
              <div className="w-full md:w-48 h-48 relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-200 p-2">
                <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-contain p-2" />
              </div>
              <div className="flex-1 mt-2">
                <h3 className="text-3xl font-poppins font-semibold text-gray-800 mb-2">{selectedProduct.name}</h3>
                <span className="inline-block mt-1 px-2.5 py-1 bg-[#622581]/10 text-[#622581] text-xs font-nunito font-semibold rounded-md">
                  {selectedProduct.code}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-nunito font-medium text-gray-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-nunito font-medium text-gray-800">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-xs font-nunito font-medium text-gray-500 uppercase tracking-wider mb-1">Sub-Category</p>
                  <p className="text-sm font-nunito font-medium text-gray-800">{selectedProduct.subCategory}</p>
                </div>
                <div>
                  <p className="text-xs font-nunito font-medium text-gray-500 uppercase tracking-wider mb-1">UOM</p>
                  <p className="text-sm font-nunito font-medium text-gray-800">{selectedProduct.uom}</p>
                </div>
                <div>
                  <p className="text-xs font-nunito font-medium text-gray-500 uppercase tracking-wider mb-1">HSN Code</p>
                  <p className="text-sm font-nunito font-medium text-gray-800">{selectedProduct.hsnCode || 'N/A'}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs font-nunito font-medium text-gray-500 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm font-nunito font-normal text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[60px]">
                  {selectedProduct.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">
                Edit Product
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Product Name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                    Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Code"
                    value={editFormData.code}
                    onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                    UOM
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                    value={editFormData.uom}
                    onChange={(e) => setEditFormData({ ...editFormData, uom: e.target.value })}
                    required
                  >
                    <option value="">Select UOM</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Gms">Gms</option>
                    <option value="Liters">Liters</option>
                    <option value="ml">ml</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Packs">Packs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                    HSN Code
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="Enter 8-digit HSN Code"
                    value={editFormData.hsnCode}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      setEditFormData({ ...editFormData, hsnCode: onlyNums });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter Description"
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Category"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Sub-Category"
                    value={editFormData.subCategory}
                    onChange={(e) => setEditFormData({ ...editFormData, subCategory: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#622581] hover:bg-[#622581]/90 text-white font-poppins font-medium py-2.5 rounded-lg transition duration-200 mt-4">
                Update Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-medium text-gray-800">
                Delete Product
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-poppins font-medium text-gray-800 mb-2">
                Are you sure?
              </h3>
              <p className="text-sm font-nunito font-normal text-gray-600 mb-6">
                Do you really want to delete <strong>"{selectedProduct?.name}"</strong>? This action cannot be undone.
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
