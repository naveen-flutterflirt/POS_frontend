// app/dashboard/price-management/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function PriceManagementPage() {
  const [formData, setFormData] = useState({
    productName: "",
    basePrice: "",
    additionalCharges: "",
    tax: "",
    status: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
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
              href="/dashboard" 
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
              {/* Product Name */}
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Product Name
                </label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                >
                  <option value="">Select Product</option>
                  <option value="product1">Product 1</option>
                  <option value="product2">Product 2</option>
                  <option value="product3">Product 3</option>
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