"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Plus, Settings } from "lucide-react";
import { RoleCard } from "./RoleCard";
import { EmployeeCard } from "./EmployeeCard";
import { ModuleAccessCard } from "./ModuleAccessCard";
import { PermissionsTable } from "./PermissionsTable";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useGetStaffRolesQuery } from "@/redux/features/auth/staff.api";
import { fakeemployees, fakeroles } from "./Mockdata";
import { AddRoleDialog } from "./AddRoleDialog";
import { toast } from "sonner";
import {
  useCreateStaffRoleMutation,
  useUpdateStaffRoleMutation,
  useDeleteStaffRoleMutation,
} from "@/redux/features/auth/staff.api";
import { Skeleton } from "@/components/ui/skeleton";

export const RoleManagement = () => {
  const {
    data: staffRoles,
    isLoading,
    isError,
    refetch,
  } = useGetStaffRolesQuery();
  const [createStaffRole] = useCreateStaffRoleMutation();
  const [updateStaffRole] = useUpdateStaffRoleMutation();
  const [deleteStaffRole] = useDeleteStaffRoleMutation();

  const [selectedRole, setSelectedRole] = useState(fakeroles[0]);
  const [selectedEmployee, setSelectedEmployee] = useState(fakeemployees[0]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // Set first role as selected when data loads, but only if no role is currently selected
  useEffect(() => {
    if (staffRoles && staffRoles.length > 0 && !selectedRole) {
      setSelectedRole(staffRoles[0]);
    }
  }, [staffRoles, selectedRole]);

  const handleDeleteRole = async () => {
    try {
      await deleteStaffRole(roleToDelete._id).unwrap();
      toast.success("Role deleted successfully");
      setDeleteDialogOpen(false);
      refetch();
      // Select a different role if the deleted one was selected
      if (selectedRole?._id === roleToDelete._id) {
        setSelectedRole(staffRoles?.[0] || fakeroles[0]);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete role");
    }
  };

  const handleUpdateModulePermissions = async (
    moduleId,
    updatedPermissions
  ) => {
    if (!selectedRole) return;

    try {
      const updatedModuleAccess = selectedRole.moduleAccess.map((module) => {
        if (module.module._id === moduleId) {
          return {
            ...module,
            permissions: updatedPermissions,
          };
        }
        return module;
      });

      const updatedRole = {
        ...selectedRole,
        moduleAccess: updatedModuleAccess,
      };

      await updateStaffRole({
        id: selectedRole._id,
        ...updatedRole,
        moduleId: moduleId,
      }).unwrap();

      setSelectedRole(updatedRole);
      toast.success("Permissions updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update permissions");
    }
  };

  const handleToggleModule = async (moduleId, isEnabled) => {
    if (!selectedRole) return;

    try {
      const updatedModuleAccess = selectedRole.moduleAccess.map((module) => {
        if (module.module === moduleId) {
          return {
            ...module,
            isEnabled,
            // Reset permissions if disabling the module
            permissions: isEnabled ? module.permissions : [],
          };
        }
        return module;
      });

      const updatedRole = {
        ...selectedRole,
        moduleAccess: updatedModuleAccess,
      };

      await updateStaffRole({
        id: selectedRole._id,
        ...updatedRole,
      }).unwrap();

      setSelectedRole(updatedRole);
      toast.success(
        `Module ${isEnabled ? "enabled" : "disabled"} successfully`
      );
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update module status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-8 bg-gray-50 min-h-screen p-4">
        <Card className="p-4 md:p-6 shadow-lg mx-auto">
          <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
            <div className="w-full xl:w-2/5 space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full xl:w-3/5 mt-4 lg:mt-0">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 md:space-y-8 bg-gray-50 min-h-screen p-4">
        <Card className="p-4 md:p-6 shadow-lg mx-auto">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-red-600">
              Failed to load roles
            </h2>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8 bg-gray-50 min-h-screen p-4">
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRole}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
      />

      {/* Roles Section */}
      <Card className="p-4 md:p-6 shadow-lg mx-auto">
        <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
          {/* Left Panel - Role List */}
          <div className="w-full xl:w-2/5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#DFB547]" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  Roles Management
                </h2>
              </div>
              <AddRoleDialog
                modules={selectedRole?.moduleAccess}
                onSuccess={(newRole) => {
                  refetch();
                  setSelectedRole(newRole);
                  toast.success("Role created successfully");
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs md:text-sm bg-[#001C44]/90 hover:bg-[#001C44] text-white hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add Role
                </Button>
              </AddRoleDialog>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-700 flex items-center gap-2 text-sm md:text-base">
                <Settings className="h-4 w-4" />
                Role List
              </h3>
              <div className="space-y-2 max-h-[400px]">
                {staffRoles &&
                  staffRoles.map((role) => (
                    <RoleCard
                      key={role._id}
                      role={role}
                      isSelected={selectedRole?._id === role._id}
                      onClick={() => setSelectedRole(role)}
                      onDelete={(role) => {
                        setRoleToDelete(role);
                        setDeleteDialogOpen(true);
                      }}
                      selectedRole={selectedRole}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Role Details */}
          <div className="w-full xl:w-3/5 mt-4 lg:mt-0">
            <div className="space-y-4 md:space-y-6">
              <Card className="w-full shadow-none border-none p-0 py-4">
                <CardHeader className="px-2 md:px-4">
                  <CardTitle className="text-lg md:text-xl font-medium text-gray-700">
                    Module Access for {selectedRole?.name}
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-500">
                    Click on any module to enable/disable it, then set specific
                    permissions below
                  </p>
                </CardHeader>
                <CardContent className="px-2 md:px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                    {selectedRole?.moduleAccess.map((module) => (
                      <ModuleAccessCard
                        key={module._id}
                        module={module}
                        onToggle={(isEnabled) =>
                          handleToggleModule(module.module, isEnabled)
                        }
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <PermissionsTable
                modules={selectedRole?.moduleAccess.filter((m) => m.isEnabled)}
                onPermissionChange={handleUpdateModulePermissions}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Employees Section */}
      {/* <Card className="p-4 md:p-6 shadow-lg mx-auto">
        <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
          <div className="w-full xl:w-2/5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#DFB547]" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  Employee Management
                </h2>
              </div>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2 text-xs md:text-sm bg-[#001C44]/90 hover:bg-[#001C44] text-white hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-700 flex items-center gap-2 text-sm md:text-base">
                <Settings className="h-4 w-4" />
                Employee List
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {fakeemployees.map((employee) => {
                  const role = (staffRoles || fakeroles).find(
                    (r) => r._id === employee.roleId
                  );
                  return (
                    <EmployeeCard
                      key={employee._id}
                      employee={employee}
                      role={role}
                      isSelected={selectedEmployee?._id === employee._id}
                      onClick={() => setSelectedEmployee(employee)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full xl:w-3/5 mt-4 lg:mt-0">
            <div className="space-y-4 md:space-y-6">
              <Card className="w-full shadow-none border-none">
                <CardHeader className="px-2 md:px-4">
                  <CardTitle className="text-lg md:text-xl font-medium text-gray-700">
                    Access Control for {selectedEmployee?.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>
                      Role:{" "}
                      <strong>
                        {
                          (staffRoles || fakeroles).find(
                            (r) => r._id === selectedEmployee?.roleId
                          )?.name
                        }
                      </strong>
                    </span>
                    {selectedEmployee?.customAccess?.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 text-xs"
                      >
                        Custom Permissions
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-2 md:px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                    {(staffRoles || fakeroles)
                      .find((r) => r._id === selectedEmployee?.roleId)
                      ?.moduleAccess.map((module) => {
                        const isCustom = selectedEmployee?.customAccess?.some(
                          (a) => a.moduleId === module._id
                        );
                        return (
                          <ModuleAccessCard
                            key={module._id}
                            module={module}
                            onToggle={(isEnabled) =>
                              handleToggleModule(module.module, isEnabled)
                            }
                          />
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              <PermissionsTable
                modules={selectedRole?.moduleAccess.filter((m) => m.isEnabled)}
                onPermissionChange={(moduleId, updatedPermissions) =>
                  handleUpdateModulePermissions(moduleId, updatedPermissions)
                }
              />
            </div>
          </div>
        </div>
      </Card> */}
    </div>
  );
};
