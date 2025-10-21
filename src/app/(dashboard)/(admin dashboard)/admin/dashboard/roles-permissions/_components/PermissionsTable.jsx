"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const PermissionsTable = ({
  modules,
  isEmployeeView = false,
  customAccess = [],
  onPermissionChange, // Add this prop
}) => {
  // Filter modules to only show enabled ones
  const enabledModules = modules?.filter((module) => {
    if (isEmployeeView) {
      // For employee view, check if module is enabled in either custom access or role permissions
      const customModule = customAccess.find((a) => a.moduleId === module._id);
      return customModule ? customModule.isEnabled : module.isEnabled;
    }
    return module.isEnabled;
  });

  const handlePermissionChange = (moduleId, permission, isChecked) => {
    if (!onPermissionChange) return;

    // Get the current module
    const module = enabledModules.find((m) => m.module._id === moduleId);
    if (!module) return;

    // Determine current permissions
    let currentPermissions = [...module.permissions];

    // Handle migration from create/edit to write
    if (permission === "write") {
      if (isChecked) {
        // Add write permission and remove create/edit if they exist
        currentPermissions = currentPermissions.filter(
          (p) => p.toLowerCase() !== "create" && p.toLowerCase() !== "edit"
        );
        if (!currentPermissions.includes("write")) {
          currentPermissions.push("write");
        }
      } else {
        // Remove write permission
        currentPermissions = currentPermissions.filter(
          (p) => p.toLowerCase() !== "write"
        );
      }
    } else {
      // Handle other permissions normally
      if (isChecked) {
        // Add permission if not already present
        if (!currentPermissions.includes(permission.toLowerCase())) {
          currentPermissions.push(permission.toLowerCase());
        }
      } else {
        // Remove permission
        currentPermissions = currentPermissions.filter(
          (p) => p.toLowerCase() !== permission.toLowerCase()
        );
      }
    }

    // Call the parent handler
    onPermissionChange(moduleId, currentPermissions);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          <div
            className={`grid ${
              isEmployeeView ? "grid-cols-5" : "grid-cols-4"
            } bg-gray-50 border-b border-gray-200`}
          >
            <div className="px-3 py-2 md:px-4 md:py-3 text-xs font-medium text-gray-900">
              {isEmployeeView ? "Module (Status)" : "Module Permissions"}
            </div>
            <div className="px-3 py-2 md:px-4 md:py-3 text-xs font-medium text-gray-900 text-center">
              Read
            </div>
            <div className="px-3 py-2 md:px-4 md:py-3 text-xs font-medium text-gray-900 text-center">
              Write
            </div>
            <div className="px-3 py-2 md:px-4 md:py-3 text-xs font-medium text-gray-900 text-center">
              Delete
            </div>
            {isEmployeeView && (
              <div className="px-3 py-2 md:px-4 md:py-3 text-xs font-medium text-gray-900 text-center">
                Source
              </div>
            )}
          </div>

          {enabledModules?.length > 0 ? (
            enabledModules.map((module, index) => {
              const effectivePermissions = isEmployeeView
                ? customAccess.find((a) => a.moduleId === module._id)
                    ?.permissions || module.permissions
                : module.permissions;

              const isCustom =
                isEmployeeView &&
                customAccess.some((a) => a.moduleId === module._id);

              return (
                <div
                  key={module._id}
                  className={`grid ${
                    isEmployeeView ? "grid-cols-5" : "grid-cols-4"
                  } border-b border-gray-200 last:border-b-0 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="px-3 py-2 md:px-4 md:py-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">
                      {module.module.name}
                    </span>
                  </div>
                  <div className="px-3 py-2 md:px-4 md:py-3 flex justify-center items-center">
                    <Checkbox
                      checked={
                        effectivePermissions.includes("View") ||
                        effectivePermissions.includes("view")
                      }
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          module.module._id,
                          "View",
                          checked
                        )
                      }
                      className="h-4 w-4 data-[state=checked]:bg-[#DFB547] data-[state=checked]:border-[#DFB547]"
                    />
                  </div>
                  <div className="px-3 py-2 md:px-4 md:py-3 flex justify-center items-center">
                    <Checkbox
                      checked={
                        effectivePermissions.includes("write") ||
                        effectivePermissions.includes("Write") ||
                        effectivePermissions.includes("create") ||
                        effectivePermissions.includes("edit")
                      }
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          module.module._id,
                          "write",
                          checked
                        )
                      }
                      className="h-4 w-4 data-[state=checked]:bg-[#DFB547] data-[state=checked]:border-[#DFB547]"
                    />
                  </div>
                  <div className="px-3 py-2 md:px-4 md:py-3 flex justify-center items-center">
                    <Checkbox
                      checked={
                        effectivePermissions.includes("Delete") ||
                        effectivePermissions.includes("delete")
                      }
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          module.module._id,
                          "Delete",
                          checked
                        )
                      }
                      className="h-4 w-4 data-[state=checked]:bg-[#DFB547] data-[state=checked]:border-[#DFB547]"
                    />
                  </div>
                  {isEmployeeView && (
                    <div className="px-3 py-2 md:px-4 md:py-3 flex justify-center items-center">
                      <Badge
                        className={`text-xs ${
                          isCustom
                            ? "bg-blue-100 text-blue-800"
                            : "bg-[#FDF5E5] text-[#DFB547]"
                        }`}
                      >
                        {isCustom ? "Custom" : "Role"}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No enabled modules found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
