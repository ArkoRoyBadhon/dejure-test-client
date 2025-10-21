"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateStaffRoleMutation } from "@/redux/features/auth/staff.api";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RoleCard = ({
  role,
  isSelected,
  onClick,
  selectedRole,
  onDelete,
}) => {
  const [updateStaffRole] = useUpdateStaffRoleMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const dropdownRef = useRef(null);

  // State for edit form
  const [editFormData, setEditFormData] = useState({
    name: role.name,
    description: role.description || "",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleStatus = async () => {
    try {
      await updateStaffRole({
        id: role._id,
        isActive: !role.isActive,
      }).unwrap();
      toast.success(
        `Role ${!role.isActive ? "enabled" : "disabled"} successfully`
      );
      setDropdownOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update role status");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStaffRole({
        id: role._id,
        name: editFormData.name,
        description: editFormData.description,
        moduleAccess: selectedRole.moduleAccess,
      }).unwrap();
      toast.success("Role updated successfully");
      setEditDialogOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update role");
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 md:p-4 rounded-lg transition-all hover:shadow-md ${
        isSelected
          ? "bg-[#FDF5E5] border-2 border-[#DFB547] shadow-md"
          : "bg-white border border-gray-200 hover:bg-gray-50"
      } ${!role.isActive ? "opacity-70" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div className="cursor-pointer flex-grow">
          <span className="font-medium text-gray-900">{role.name}</span>
          <p className="text-xs text-gray-500 mt-1">
            Click to edit module access
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`text-xs ${
              role.isActive
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {role.moduleAccess.filter((m) => m.isEnabled).length} modules
          </Badge>

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              className="inline-flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border">
                <div className="py-1" role="none">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditDialogOpen(true);
                      setDropdownOpen(false);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </button>

                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    role="menuitem"
                  >
                    <Power className="mr-2 h-4 w-4" />
                    {role.isActive ? "Deactivate" : "Activate"}
                  </button> */}

                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(role);
                      setDropdownOpen(false);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
