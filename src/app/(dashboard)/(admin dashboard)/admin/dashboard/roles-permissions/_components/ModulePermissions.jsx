"use client";
import { useEffect } from "react";

const ModulePermissions = ({ module, control, setValue, getValues, watch }) => {
  const moduleAccess = watch("moduleAccess", []);
  const currentModule = moduleAccess.find((m) => m.module === module._id);

  // Initialize the module if it doesn't exist
  useEffect(() => {
    if (!currentModule) {
      const newModuleAccess = [
        ...moduleAccess,
        {
          module: module._id,
          isEnabled: false,
          permissions: [],
        },
      ];
      setValue("moduleAccess", newModuleAccess);
    }
  }, [module._id, moduleAccess, currentModule, setValue]);

  const toggleModule = (enabled) => {
    const updatedModuleAccess = moduleAccess.map((m) =>
      m.module === module._id ? { ...m, isEnabled: enabled } : m
    );
    setValue("moduleAccess", updatedModuleAccess, { shouldValidate: true });
  };

  const togglePermission = (permission) => {
    if (!currentModule) return;

    const updatedPermissions = currentModule.permissions.includes(permission)
      ? currentModule.permissions.filter((p) => p !== permission)
      : [...currentModule.permissions, permission];

    const updatedModuleAccess = moduleAccess.map((m) =>
      m.module === module._id ? { ...m, permissions: updatedPermissions } : m
    );
    setValue("moduleAccess", updatedModuleAccess, { shouldValidate: true });
  };

  if (!currentModule) return null;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{module.name}</h4>
          <p className="text-sm text-gray-500">{module.description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={currentModule.isEnabled}
            onChange={(e) => toggleModule(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {currentModule.isEnabled && (
        <div className="mt-3 space-y-2">
          <h5 className="text-sm font-medium">Permissions:</h5>
          <div className="flex flex-wrap gap-2">
            {["view", "write", "delete"].map((permission) => (
              <label
                key={permission}
                className="flex items-center gap-1 text-sm"
              >
                <input
                  type="checkbox"
                  checked={currentModule.permissions.includes(permission)}
                  onChange={() => togglePermission(permission)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {permission.charAt(0).toUpperCase() + permission.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulePermissions;
