// app/dashboard/product-management/create/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/context/ApiContext";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useEffect } from "react";

export default function CreateProductPage() {
  const router = useRouter();
  const { post, get } = useApi();
  
  const [categories, setCategories] = useState<any[]>([]);
  
  useEffect(() => {
    get("/catalog/categories")
      .then((data: any) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, [get]);
  
  const [formData, setFormData] = useState({
    productName: "",
    uom: "",
    description: "",
    categoryId: "",
    productCode: "",
    hsnCode: "",
    subcategoryId: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let uploadedImageUrl: string | undefined = undefined;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        const uploadRes = await post<{ url: string }>("/upload?folder=products", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedImageUrl = uploadRes.url;
      }

      await post("/catalog/products", {
        code: formData.productCode,
        name: formData.productName,
        description: formData.description,
        uom: formData.uom,
        hsnCode: formData.hsnCode,
        categoryId: Number(formData.categoryId),
        subcategoryId: formData.subcategoryId ? Number(formData.subcategoryId) : undefined,
        imageUrl: uploadedImageUrl,
      });
      router.push("/admin/dashboard/product-management");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
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
            <Link 
              href="/admin/dashboard/product-management" 
              className="hover:text-[#622581] transition-colors duration-200 cursor-pointer"
            >
              Product Management
            </Link>
            <span>&gt;</span>
            <span className="text-[#622581] font-medium">Create Product</span>
          </div>
        </div>
        <Link
          href="/admin/dashboard/product-management"
          className="flex items-center gap-2 mt-1 text-sm font-nunito text-[#622581] hover:text-[#4d1d67] whitespace-nowrap transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product Management
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 py-6">
          {/* Section Title */}
          <h2 className="text-base font-poppins font-medium text-gray-800 mb-5">
            Create Product
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: "" })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Sub-Category
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                  value={formData.subcategoryId}
                  onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                  disabled={!formData.categoryId}
                >
                  <option value="">Select Sub-Category</option>
                  {categories
                    .find((c) => c.id.toString() === formData.categoryId)
                    ?.subcategories?.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Product Code
                </label>
                <input
                  type="text"
                  placeholder="Enter Code"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  value={formData.productCode}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  UOM
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition bg-white"
                  value={formData.uom}
                  onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
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
                  HSN-Code
                </label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Enter 8-digit HSN Code"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition"
                  value={formData.hsnCode}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, hsnCode: onlyNums });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="(ex: Pure, hand-ground turmeric sourced from local farms.)"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito font-normal text-sm text-gray-700 focus:ring-2 focus:ring-[#622581]/30 focus:border-[#622581] outline-none transition resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-nunito font-medium text-gray-700 mb-1.5">
                Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#622581] transition group">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#622581] transition" />
                    <span className="text-xs text-gray-400 mt-1">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
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
