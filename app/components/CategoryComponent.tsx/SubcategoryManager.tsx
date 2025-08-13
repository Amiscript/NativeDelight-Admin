
import React, { useState } from 'react';
import { SubCategory } from './types';

interface SubcategoryManagerProps {
  subcategories: SubCategory[];
  onSubcategoriesChange: (subcategories: SubCategory[]) => void;
}

const SubcategoryManager: React.FC<SubcategoryManagerProps> = ({
  subcategories = [],
  onSubcategoriesChange,
}) => {
  const [newSubcategory, setNewSubcategory] = useState<Partial<SubCategory>>({
    name: '',
    description: '',
  });

  const handleAddSubcategory = () => {
    if (!newSubcategory.name) return;
    const updatedSubcategories = [
      ...subcategories,
      {
        _id: Date.now().toString(), // Use _id and convert to string
        name: newSubcategory.name || '',
        description: newSubcategory.description || '',
      },
    ];
    onSubcategoriesChange(updatedSubcategories);
    setNewSubcategory({ name: '', description: '' });
  };

  const handleDeleteSubcategory = (_id: string) => {
    onSubcategoriesChange(subcategories.filter((sub) => sub._id !== _id));
  };

  const moveSubcategory = (_id: string, direction: 'up' | 'down') => {
    const idx = subcategories.findIndex((sub) => sub._id === _id);
    if (idx === -1) return;
    const newSubcategories = [...subcategories];
    if (direction === 'up' && idx > 0) {
      [newSubcategories[idx - 1], newSubcategories[idx]] = [
        newSubcategories[idx],
        newSubcategories[idx - 1],
      ];
    }
    if (direction === 'down' && idx < newSubcategories.length - 1) {
      [newSubcategories[idx + 1], newSubcategories[idx]] = [
        newSubcategories[idx],
        newSubcategories[idx + 1],
      ];
    }
    onSubcategoriesChange(newSubcategories);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Subcategories</label>
      <div className="space-y-2">
        {subcategories.map((sub, idx, arr) => (
          <div key={sub._id} className="flex items-center space-x-2">
            <span className="text-sm font-semibold">{sub.name}</span>
            <span className="text-xs text-gray-500">{sub.description}</span>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-xs"
              disabled={idx === 0}
              onClick={() => moveSubcategory(sub._id, 'up')}
              title="Move Up"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-xs"
              disabled={idx === arr.length - 1}
              onClick={() => moveSubcategory(sub._id, 'down')}
              title="Move Down"
            >
              <i className="fas fa-arrow-down"></i>
            </button>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 text-xs"
              onClick={() => handleDeleteSubcategory(sub._id)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <input
            type="text"
            placeholder="Subcategory name"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm"
            value={newSubcategory.name || ''}
            onChange={(e) =>
              setNewSubcategory({ ...newSubcategory, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm"
            value={newSubcategory.description || ''}
            onChange={(e) =>
              setNewSubcategory({ ...newSubcategory, description: e.target.value })
            }
          />
          <button
            type="button"
            className="bg-green-600 text-white px-2 py-1 rounded-md text-xs"
            onClick={handleAddSubcategory}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryManager;