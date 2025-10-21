import { useMemo } from "react";

/**
 * Custom hook to check for permission errors in API responses
 * @param {Object} data - API response data
 * @returns {Object} - Permission check results
 */
export const usePermissionCheck = (data) => {
  const permissionCheck = useMemo(() => {
    // Check for permission error in the data
    const hasPermissionError =
      data?.message === "Insufficient module permissions" ||
      data?.details === "Module access disabled" ||
      (data?.yourPermissions && !data.yourPermissions.isEnabled);

    // Check if data contains actual content (not permission error)
    const hasValidData = data?.data && !hasPermissionError;

    // Get error details for display
    const errorDetails = hasPermissionError
      ? {
          message: data?.message || "Access Denied",
          details:
            data?.details ||
            "You don't have permission to access this resource",
          required: data?.required || null,
          yourPermissions: data?.yourPermissions || null,
        }
      : null;

    return {
      hasPermissionError,
      hasValidData,
      errorDetails,
      data: hasValidData ? data.data : null,
    };
  }, [data]);

  return permissionCheck;
};

export default usePermissionCheck;
