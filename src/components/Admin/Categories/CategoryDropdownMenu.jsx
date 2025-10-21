import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

export function CategoryDropdownMenu({ category, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    onEdit();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-gray-500 hover:text-gray-700 p-1"
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit size={14} /> Update
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
