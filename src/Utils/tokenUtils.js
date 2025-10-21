/**
 * Token validation and management utilities
 */

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - true if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    // Decode JWT token (without verification)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If we can't decode, consider it expired
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error("Error getting token expiration:", error);
    return null;
  }
};

/**
 * Get time until token expires (in minutes)
 * @param {string} token - JWT token
 * @returns {number} - Minutes until expiration
 */
export const getMinutesUntilExpiration = (token) => {
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiration = payload.exp - currentTime;

    return Math.max(0, Math.floor(timeUntilExpiration / 60));
  } catch (error) {
    console.error("Error calculating token expiration:", error);
    return 0;
  }
};

/**
 * Check if token will expire soon (within specified minutes)
 * @param {string} token - JWT token
 * @param {number} minutesThreshold - Minutes threshold (default: 5)
 * @returns {boolean} - true if token expires soon
 */
export const isTokenExpiringSoon = (token, minutesThreshold = 5) => {
  return getMinutesUntilExpiration(token) <= minutesThreshold;
};

/**
 * Validate token format
 * @param {string} token - JWT token
 * @returns {boolean} - true if token format is valid
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  return parts.length === 3;
};

/**
 * Get user info from token
 * @param {string} token - JWT token
 * @returns {object|null} - User info or null if invalid
 */
export const getUserInfoFromToken = (token) => {
  if (!token || !isValidTokenFormat(token)) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      role: payload.role,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error("Error getting user info from token:", error);
    return null;
  }
};

/**
 * Check if user should be redirected to login
 * @param {string} token - JWT token
 * @param {string} currentPath - Current pathname
 * @returns {boolean} - true if should redirect to login
 */
export const shouldRedirectToLogin = (token, currentPath) => {
  // Don't redirect if already on auth pages
  const authPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
  ];
  if (authPaths.some((path) => currentPath.includes(path))) {
    return false;
  }

  // Redirect if token is expired or invalid
  return !token || isTokenExpired(token);
};
