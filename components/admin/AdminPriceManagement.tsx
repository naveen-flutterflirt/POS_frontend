"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function AdminPriceManagement() {
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    productId: "",
    basePrice: "",
    additionalCharges: "",
    tax: "",
    status: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const { get, post } = useApi();

  useEffect(() => {
    // Load categories, products and prices
    Promise.all([get("/catalog/categories"), get("/catalog/products"), get("/price")])
      .then(([cats, prods, prcs]) => {
        setCategories(cats || []);
        setProducts(prods || []);
        setPrices(prcs || []);
      })
      .catch((e) => console.error(e));
  }, [get]);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const selectedCat = categories.find((c) => c.id.toString() === formData.categoryId);
      setSubcategories(selectedCat?.subcategories || []);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        productId: Number(formData.productId),
        basePrice: parseFloat(formData.basePrice),
        additionalCharges: formData.additionalCharges ? parseFloat(formData.additionalCharges) : undefined,
        tax: formData.tax ? parseFloat(formData.tax) : undefined,
        status: formData.status || "Active",
      };
      const newPrice = await post("/price", data);
      setPrices([...prices, newPrice]);
      alert("Price added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add price");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Add Price Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-medium text-gray-800">
            Price Management
          </h1>
          <div className="flex items-center gap-2 text-sm font-nunito font-normal text-gray-500 mt-1">
            <Link 
              href="/admin/dashboard" 
              className="hover:text-[#622581] transition-colors duration-200 cursor-pointer"
            >
              Admin
            </Link>
            <span>&gt;</span>
            <span className="text-[#622581] font-medium">Price Management</span>
          </div>
        </div>
        
        {/* Add Price Button - Top Right */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#622581] hover:bg-[#622581]/90 text-white font-nunito font-medium text-sm rounded-lg transition duration-200 cursor-pointer whitespace-nowrap shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4" />
          Add Price
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Section Title */}
          <h2 className="text-base font-poppins font-medium text-gray-800 mb-6">
            Price Management
          </h2>

          {/* Form - 2 Columns */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Category */}
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: "", productId: "" })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Sub Category */}
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Sub Category
                </label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                  value={formData.subcategoryId}
                  onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value, productId: "" })}
                >
                  <option value="">Select Sub Category</option>
                  {subcategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Product Name
                </label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                >
                  <option value="">Select Product</option>
                  {products
                    .filter((p) => {
                      if (formData.subcategoryId) return p.subcategoryId?.toString() === formData.subcategoryId;
                      if (formData.categoryId) return p.categoryId?.toString() === formData.categoryId;
                      return true;
                    })
                    .map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Base Price */}
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Base Price
                </label>
                <input
                  type="text"
                  placeholder="Enter base Price"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                />
              </div>

              {/* Additional Charges */}
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Additional Charges
                </label>
                <input
                  type="text"
                  placeholder="Enter addition charges"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  value={formData.additionalCharges}
                  onChange={(e) => setFormData({ ...formData, additionalCharges: e.target.value })}
                />
              </div>

              {/* Tax */}
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Tax
                </label>
                <input
                  type="text"
                  placeholder="Enter Tax"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                />
              </div>

              {/* Status - Now in Half Width (Same as Others) */}
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Submit Button - Bottom Right */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#622581] hover:bg-[#622581]/90 text-white font-poppins font-medium text-sm rounded-lg transition duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
