import { useSelector } from "react-redux";

export const usePermissions = () => {
  const user = useSelector((state) => state.auth?.user);

  const hasPermission = (moduleName, permissionType) => {
    // If user is admin or superadmin, allow all permissions
    if (user?.role === "admin" || user?.role === "superadmin") {
      return true;
    }

    // If user is staff, check permissions
    if (user?.role === "staff" && user?.permissions) {
      // Find the module in permissions
      const modulePermission = Object.values(user.permissions).find(
        (perm) =>
          perm.module?.name === moduleName || perm.module?.slug === moduleName
      );

      if (!modulePermission) {
        return false;
      }

      // Check if module is enabled
      if (!modulePermission.isEnabled) {
        return false;
      }

      // Check specific permission
      const permissions = modulePermission.permissions || [];

      // Handle different permission types
      switch (permissionType) {
        case "view":
        case "read":
          return (
            permissions.includes("view") ||
            permissions.includes("read") ||
            permissions.includes("*")
          );
        case "create":
        case "write":
          return (
            permissions.includes("write") ||
            permissions.includes("create") ||
            permissions.includes("*")
          );
        case "update":
        case "edit":
          return (
            permissions.includes("write") ||
            permissions.includes("update") ||
            permissions.includes("edit") ||
            permissions.includes("*")
          );
        case "delete":
          return permissions.includes("delete") || permissions.includes("*");
        case "full":
        case "all":
          return (
            permissions.includes("*") ||
            permissions.includes("full") ||
            permissions.includes("all")
          );
        default:
          return (
            permissions.includes(permissionType) || permissions.includes("*")
          );
      }
    }

    // If user is representative, check basic permissions
    if (user?.role === "representative") {
      // Representatives might have limited access
      return permissionType === "view" || permissionType === "read";
    }

    // Default: no permission
    return false;
  };

  const canView = (moduleName) => hasPermission(moduleName, "view");
  const canCreate = (moduleName) => hasPermission(moduleName, "create");
  const canUpdate = (moduleName) => hasPermission(moduleName, "update");
  const canDelete = (moduleName) => hasPermission(moduleName, "delete");

  return {
    user,
    hasPermission,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    isAdmin: user?.role === "admin" || user?.role === "superadmin",
    isStaff: user?.role === "staff",
    isRepresentative: user?.role === "representative",
  };
};
