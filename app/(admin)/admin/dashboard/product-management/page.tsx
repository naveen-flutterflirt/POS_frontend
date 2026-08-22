// app/dashboard/product-management/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ProductManagementPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const totalPages = 10;

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products list on mount
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    setIsLoading(true);
    fetch(`${apiUrl}/catalog/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            image: "/Images/image.png", // Fallback placeholder image asset
            code: p.code,
            uom: p.uom,
            hsnCode: p.hsnCode,
            description: p.description || "",
            fssai: p.fssaiNumber || "",
            category: p.category?.name || "Category",
            subCategory: p.subCategory?.name || p.subcategoryId,
          }));
          setProducts(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    uom: "",
    hsnCode: "",
    description: "",
    fssai: "",
    category: "",
    subCategory: "",
  });

  // Delete handler
  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    const filteredProducts = products.filter((p) => p.id !== selectedProduct.id);
    setProducts(filteredProducts);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
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
      fssai: product.fssai,
      category: product.category,
      subCategory: product.subCategory,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id
        ? { ...p, ...editFormData }
        : p
    );
    setProducts(updatedProducts);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-poppins font-medium text-gray-800">
            Product Master Details
          </h2>
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
                  FSSAI
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center font-nunito text-sm text-gray-400">
                    No products found. Add one to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
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
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 max-w-[150px] truncate">
                      {product.description}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                      {product.fssai}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito font-normal text-gray-700 whitespace-nowrap">
                      {product.subCategory}
                    </td>
                    <td className="px-4 py-4 text-sm font-nunito text-gray-700">
                      <div className="flex items-center gap-1.5">
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
            Showing {products.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-[#622581] hover:bg-[#622581]/10 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm font-nunito font-normal rounded-lg transition duration-200 cursor-pointer ${currentPage === page
                      ? "bg-[#622581] text-white"
                      : "text-gray-600 hover:bg-[#622581]/10 hover:text-[#622581]"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 text-sm font-nunito font-normal rounded-lg transition duration-200 cursor-pointer ${currentPage === totalPages
                      ? "bg-[#622581] text-white"
                      : "text-gray-600 hover:bg-[#622581]/10 hover:text-[#622581]"
                      }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-[#622581] hover:bg-[#622581]/10 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

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
                  <input
                    type="text"
                    placeholder="Enter UOM"
                    value={editFormData.uom}
                    onChange={(e) => setEditFormData({ ...editFormData, uom: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                    HSN Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter HSN Code"
                    value={editFormData.hsnCode}
                    onChange={(e) => setEditFormData({ ...editFormData, hsnCode: e.target.value })}
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
                    FSSAI
                  </label>
                  <input
                    type="text"
                    placeholder="Enter FSSAI"
                    value={editFormData.fssai}
                    onChange={(e) => setEditFormData({ ...editFormData, fssai: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
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
