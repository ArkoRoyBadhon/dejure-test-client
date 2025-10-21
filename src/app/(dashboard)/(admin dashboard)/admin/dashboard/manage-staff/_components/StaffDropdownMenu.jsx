"use client";
import React from "react";
import { Edit, MoreVertical, Power, Trash2 } from "lucide-react";

const StaffDropdownMenu = React.forwardRef(
  ({ staff, isOpen, onToggle, onEdit, onToggleStatus, onDelete }, ref) => {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg">
            <div className="py-1">
              <button
                onClick={() => onEdit(staff)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => onToggleStatus(staff)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Power className="mr-2 h-4 w-4" />
                {staff.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => onDelete(staff)}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

StaffDropdownMenu.displayName = "StaffDropdownMenu";

export default StaffDropdownMenu;
