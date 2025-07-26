import React from "react";
import Image from "next/image";
import { MenuItem, SubCategory } from "../ManagementComp/types";

interface MenuItemFormProps {
  item: MenuItem;
  categories: string[];
  subCategories: { [key: string]: SubCategory[] };
  onItemChange: (updatedItem: MenuItem) => void;
  onMoveSubcategory: (category: string, subId: number, direction: 'up' | 'down') => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  item,
  categories,
  subCategories,
  onItemChange,
  onMoveSubcategory,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onItemChange({
      ...item,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onItemChange({ ...item, image: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <input
          type="text"
          name="name"
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={item.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
        <input
          type="number"
          name="price"
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={item.price}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={item.category}
          onChange={(e) => {
            handleChange(e);
            onItemChange({ ...item, category: e.target.value, subCategory: "" });
          }}
          required
        >
          <option value="">Select Category</option>
          {categories.filter(cat => cat !== "All").map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      {item.category && subCategories[item.category] && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Subcategory</label>
          <div className="flex flex-col gap-1">
            {subCategories[item.category].map((sub, idx, arr) => (
              <div key={sub.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subCategory"
                  checked={item.subCategory === sub.name}
                  onChange={() => onItemChange({ ...item, subCategory: sub.name })}
                />
                <span>{sub.name}</span>
                <button
                  type="button"
                  className="text-xs px-1"
                  disabled={idx === 0}
                  onClick={() => onMoveSubcategory(item.category, sub.id, 'up')}
                  title="Move Up"
                >▲</button>
                <button
                  type="button"
                  className="text-xs px-1"
                  disabled={idx === arr.length - 1}
                  onClick={() => onMoveSubcategory(item.category, sub.id, 'down')}
                  title="Move Down"
                >▼</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
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
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={item.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleImageChange}
          />
          <span className="text-xs text-gray-400 text-center">or paste an image URL below</span>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={item.image}
            onChange={handleChange}
          />
          {item.image && (
            <Image
              src={item.image}
              alt="Preview"
              className="mt-2 h-24 w-24 object-cover rounded-md border"
              width={96}
              height={96}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button"
        >
          {isEditing ? 'Save Changes' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default MenuItemForm;