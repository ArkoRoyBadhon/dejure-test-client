"use client";
import React, { useState } from "react";
import { X, Upload, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useGetStaffRolesQuery } from "@/redux/features/auth/staff.api";

const StaffFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  staffData,
  onChange,
  onImageUpload,
  onRemoveImage,
  imagePreview,
  isEdit = false,
}) => {
  const { data: rolesData } = useGetStaffRolesQuery();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleRoleSelect = (roleId) => {
    onChange({
      target: {
        name: "roleType",
        value: roleId,
      },
    });
    setIsRoleDropdownOpen(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4 ${
        !isOpen && "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <button
                      onClick={onRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray1"
                value={staffData.fullName}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray1"
                value={staffData.email}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray1"
                value={staffData.phone}
                onChange={onChange}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray1 text-left flex items-center justify-between"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  {staffData.roleType
                    ? rolesData?.find((r) => r._id === staffData.roleType)
                        ?.name || "Select a role"
                    : "Select a role"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isRoleDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isRoleDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                    {rolesData?.map((role) => (
                      <div
                        key={role._id}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                          staffData.roleType == role._id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleRoleSelect(role._id)}
                      >
                        {role.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="hidden"
                name="roleType"
                value={staffData.roleType || ""}
              />
            </div>

            {!isEdit && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray1"
                  value={staffData.password}
                  onChange={onChange}
                  required
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-main text-white rounded-md hover:bg-main/90"
          >
            {isEdit ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffFormDialog;
