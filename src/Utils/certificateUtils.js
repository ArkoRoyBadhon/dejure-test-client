// Utility functions for certificate handling

/**
 * Convert base64 string to blob
 * @param {string} base64 - Base64 encoded string
 * @param {string} mimeType - MIME type of the file
 * @returns {Blob} - Blob object
 */
export const base64ToBlob = (base64, mimeType = "application/pdf") => {
  try {
    // Validate input
    if (!base64 || typeof base64 !== "string") {
      throw new Error("Invalid base64 input: must be a non-empty string");
    }

    // Remove data URL prefix if present (e.g., "data:application/pdf;base64,")
    let cleanBase64 = base64;
    if (base64.includes(",")) {
      cleanBase64 = base64.split(",")[1];
    }

    // Validate base64 format
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(cleanBase64)) {
      throw new Error("Invalid base64 format: contains invalid characters");
    }

    // Ensure proper padding
    while (cleanBase64.length % 4) {
      cleanBase64 += "=";
    }

    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error("Error converting base64 to blob:", error);
    console.error("Base64 input:", base64?.substring(0, 100) + "...");
    throw new Error(`Failed to convert base64 to blob: ${error.message}`);
  }
};

/**
 * Download blob as file
 * @param {Blob} blob - Blob object to download
 * @param {string} filename - Name of the file
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Open blob in new tab
 * @param {Blob} blob - Blob object to open
 * @param {number} timeout - Timeout in ms to revoke URL (default: 10000)
 */
export const openBlobInNewTab = (blob, timeout = 10000) => {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), timeout);
};

/**
 * Generate certificate filename
 * @param {string} courseName - Name of the course
 * @param {string} studentName - Name of the student
 * @returns {string} - Generated filename
 */
export const generateCertificateFilename = (courseName, studentName) => {
  const sanitizedCourseName = courseName
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_");
  const sanitizedStudentName = studentName
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_");
  return `${sanitizedCourseName}_${sanitizedStudentName}_Certificate.pdf`;
};
