"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import StaffDropdownMenu from "./StaffDropdownMenu";

const StaffTable = ({
  staffData,
  searchQuery,
  onEditClick,
  onToggleStatus,
  onDelete,
}) => {
  const dropdownRefs = useRef({});
  const [expandedDropdownId, setExpandedDropdownId] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideAllDropdowns = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );

      if (isOutsideAllDropdowns) {
        setExpandedDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (staffId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedDropdownId(expandedDropdownId === staffId ? null : staffId);
  };

  return (
    <div className="">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              { label: "Name", className: "" },
              { label: "Role", className: "hidden sm:table-cell" },
              { label: "Email", className: "hidden md:table-cell" },
              { label: "Phone", className: "hidden lg:table-cell" },
              { label: "Status", className: "" },
              { label: "Actions", className: "" },
            ].map((header) => (
              <th
                key={header.label}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.className}`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staffData.length > 0 ? (
            staffData.map((staff) => (
              <tr key={staff._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={
                          staff.avatar
                            ? `${process.env.NEXT_PUBLIC_API_URL}${staff.avatar}`
                            : "/assets/icons/avatar.png"
                        }
                        width={40}
                        height={40}
                        alt={staff.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {staff.name}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">
                        {staff.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {staff?.roleType?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  {staff.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {staff.phone || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {staff.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                  <StaffDropdownMenu
                    staff={staff}
                    isOpen={expandedDropdownId === staff._id}
                    onToggle={(e) => toggleDropdown(staff._id, e)}
                    onEdit={onEditClick}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                    ref={(el) => (dropdownRefs.current[staff._id] = el)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                {searchQuery ? "No staff match your search" : "No staff found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
