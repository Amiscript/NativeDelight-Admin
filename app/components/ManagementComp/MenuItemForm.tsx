
import React from "react";
import Image from "next/image";
import { MenuItem, SubCategory } from "./types";

interface MenuItemFormProps {
  item: MenuItem;
  categories: { id: string; name: string }[];
  subCategories: { [key: string]: SubCategory[] };
  onItemChange: (updatedItem: MenuItem) => void;
  onMoveSubcategory: (category: string, subId: string, direction: "up" | "down") => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
  loading: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  item,
  categories,
  subCategories,
  onItemChange,
  onSubmit,
  onCancel,
  isEditing = false,
  loading,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onItemChange({
      ...item,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
    onItemChange({
      ...item,
      category: selectedCategoryId,
      categoryName: selectedCategory?.name || "",
      subCategory: "", // Reset subcategory when category changes
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onItemChange({ ...item, image: ev.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentCategoryId = item.category || "";

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            name="name"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={item.name}
            onChange={handleChange}
            required
            placeholder="Enter item name"
          />
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
            <input
              type="number"
              name="price"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={item.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="Enter price"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={currentCategoryId}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:gap-4">
          {currentCategoryId && subCategories[currentCategoryId] && subCategories[currentCategoryId].length > 0 ? (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Subcategory</label>
              <select
                name="subCategory"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={item.subCategory || ""}
                onChange={(e) => onItemChange({ ...item, subCategory: e.target.value })}
                required
              >
                <option value="">Select Subcategory</option>
                {subCategories[currentCategoryId].map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex-1" />
          )}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Stock Status</label>
            <select
              name="stock"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={item.stock}
              onChange={handleChange}
              required
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={item.description}
            onChange={handleChange}
            required
            placeholder="Enter item description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleImageChange}
            />
            <div className="flex items-baseline justify-between flex-col md:flex-row md:gap-0 gap-3">
              {item.image && (
                <Image
                  src={item.image}
                  alt="Preview"
                  className="mt-2 h-24 w-24 object-cover rounded-md border"
                  width={96}
                  height={96}
                />
              )}
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : isEditing ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;
