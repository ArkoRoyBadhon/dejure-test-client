import { useMemo } from "react";

/**
 * Custom hook to check multiple API responses for permission errors
 * @param {Array} dataArray - Array of API response data objects
 * @returns {Object} - Combined permission check results
 */
export const useMultiplePermissionCheck = (dataArray) => {
  const permissionCheck = useMemo(() => {
    // Check all data sources for permission errors
    const hasAnyPermissionError = dataArray.some(
      (data) =>
        data?.message === "Insufficient module permissions" ||
        data?.details === "Module access disabled" ||
        (data?.yourPermissions && !data.yourPermissions.isEnabled)
    );

    // Get the first error details found
    const errorDetails = dataArray.find(
      (data) =>
        data?.message === "Insufficient module permissions" ||
        data?.details === "Module access disabled" ||
        (data?.yourPermissions && !data.yourPermissions.isEnabled)
    );

    // Check if all data sources have valid data
    const allDataValid = dataArray.every(
      (data) =>
        data?.data &&
        data?.message !== "Insufficient module permissions" &&
        data?.details !== "Module access disabled" &&
        (!data?.yourPermissions || data.yourPermissions.isEnabled)
    );

    // Get valid data from all sources
    const validData = dataArray.map((data) =>
      data?.data &&
      data?.message !== "Insufficient module permissions" &&
      data?.details !== "Module access disabled" &&
      (!data?.yourPermissions || data.yourPermissions.isEnabled)
        ? data.data
        : null
    );

    return {
      hasAnyPermissionError,
      allDataValid,
      errorDetails: errorDetails
        ? {
            message: errorDetails.message || "Access Denied",
            details:
              errorDetails.details ||
              "You don't have permission to access this resource",
            required: errorDetails.required || null,
            yourPermissions: errorDetails.yourPermissions || null,
          }
        : null,
      validData,
    };
  }, [dataArray]);

  return permissionCheck;
};

export default useMultiplePermissionCheck;
