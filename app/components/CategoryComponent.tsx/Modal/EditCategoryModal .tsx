
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Category, SubCategory } from '../types';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  subcategories: SubCategory[];
  onSave: (updatedCategory: Category) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, category: initialCategory, subcategories, onSave }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  console.log("subcategories", subcategories)
  useEffect(() => {
    if (initialCategory) {
      const subIds = initialCategory.subcategories?.map((sub: any) => sub._id || sub) || []; // Extract IDs if objects or keep if strings
      setCategory({
        ...initialCategory,
        subcategories: Array.from(new Set(subIds)), // Deduplicate and ensure unique IDs
      });
    }
  }, [initialCategory]);

  const handleAddSubcategory = () => {
    if (!selectedSubcategoryId || !category) return;
    if (category.subcategories?.includes(selectedSubcategoryId)) {
      console.warn('Subcategory already added');
      return;
    }
    // const selectedSub = subcategories.find((sub) => sub._id === selectedSubcategoryId);
    setCategory({
      ...category,
      subcategories: [...(category.subcategories || []), selectedSubcategoryId],
    });
    setSelectedSubcategoryId('');
  };

  const handleRemoveSubcategory = (subcategoryId: string) => {
    if (!category) return;
    setCategory({
      ...category,
      subcategories: category.subcategories?.filter((id) => id !== subcategoryId) || [],
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) return;
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory({ ...category, image: { url: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      onSave({ ...category, image: imageFile ? { url: category.image.url } : category.image });
      onClose();
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Category</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={category.name}
                  onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={category.description}
                  onChange={(e) => setCategory({ ...category, description: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image
                </label>
                <div className="flex items-center">
                  {category.image?.url ? (
                    <div className="relative mr-4">
                      <Image
                        src={category.image.url}
                        alt="Category preview"
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() => setCategory({ ...category, image: { url: '' } })}
                      >
                        ×
                      </button>
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-gray-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={category.status}
                  onChange={(e) => setCategory({ ...category, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategories
                </label>
                <div className="space-y-2 mb-2">
                  {category.subcategories?.map((subId) => {
                    const sub = subcategories.find((s) => s._id === subId);
                    return (
                      <div key={subId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="font-medium">{sub?.name || 'Unknown'}</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveSubcategory(subId)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
                {subcategories.length === 0 ? (
                  <p className="text-sm text-gray-500">No subcategories available</p>
                ) : (
                  <div className="flex space-x-2">
                    <select
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={selectedSubcategoryId}
                      onChange={(e) => {
                        const selectedSub = subcategories.find((sub) => sub._id === e.target.value);
                        console.log('Selected subcategory:', selectedSub);
                        setSelectedSubcategoryId(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Select a subcategory
                      </option>
                      {subcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={handleAddSubcategory}
                      disabled={!selectedSubcategoryId}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;