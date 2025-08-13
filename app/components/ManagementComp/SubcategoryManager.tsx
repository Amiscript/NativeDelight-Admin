import React from "react";
import { SubCategory } from "../ManagementComp/types";

interface SubcategoryManagerProps {
  category: string;
  subCategories: SubCategory[];
  selectedSubCategory: string;
  onSelect: (subCategory: string) => void;
  onMove: (subId: string, direction: 'up' | 'down') => void;
}

const SubcategoryManager: React.FC<SubcategoryManagerProps> = ({
  category,
  subCategories,
  selectedSubCategory,
  onSelect,
  onMove
}) => {
  if (!category || subCategories.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Subcategory</label>
      <div className="flex flex-col gap-1">
        {subCategories.map((sub, idx, arr) => (
          <div key={sub.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="subCategory"
              checked={selectedSubCategory === sub.name}
              onChange={() => onSelect(sub.name)}
            />
            <span>{sub.name}</span>
            <button
              type="button"
              className="text-xs px-1"
              disabled={idx === 0}
              onClick={() => onMove(sub.id, 'up')}
              title="Move Up"
            >▲</button>
            <button
              type="button"
              className="text-xs px-1"
              disabled={idx === arr.length - 1}
              onClick={() => onMove(sub.id, 'down')}
              title="Move Down"
            >▼</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryManager;