/**
 * Analytics and Tracking Utilities for DeJureAcademy.com
 * Implements GA4 and Meta Pixel tracking via dataLayer
 */

// Initialize dataLayer if it doesn't exist
if (typeof window !== "undefined") {
  window.dataLayer = window.dataLayer || [];
}

/**
 * Push event to dataLayer for GTM processing
 * @param {Object} eventData - Event data object
 */
export const pushToDataLayer = (eventData) => {
  if (typeof window !== "undefined") {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Push the event
    window.dataLayer.push(eventData);

    // Debug logging
    console.log("Analytics Event:", eventData);
    console.log("dataLayer length:", window.dataLayer.length);
    console.log("Current dataLayer:", window.dataLayer);
  } else {
    console.log("Window is undefined - server side rendering");
  }
};

/**
 * Track page view events
 * @param {string} pagePath - Current page path
 * @param {string} pageTitle - Page title
 * @param {Object} additionalData - Additional tracking data
 */
export const trackPageView = (pagePath, pageTitle, additionalData = {}) => {
  pushToDataLayer({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle,
    ...additionalData,
  });
};

/**
 * Track course view events
 * @param {Object} course - Course object
 * @param {Object} additionalData - Additional tracking data
 */
export const trackViewCourse = (course, additionalData = {}) => {
  const firstType = course.types?.[0] || {};

  pushToDataLayer({
    event: "view_course",
    course_id: course._id,
    course_name: course.title,
    course_price: firstType.price || 0,
    sale_price: firstType.salePrice || null,
    currency: "BDT",
    course_category: course.category?.title || "General",
    course_type: course.courseType || "recorded",
    payment_type: course.paymentType || "paid",
    duration_months: course.durationMonths || 0,
    batch_no: course.batchNo || 0,
    available_seats: course.seat || 0,
    page_path: window.location.pathname,
    ...additionalData,
  });
};

/**
 * Track course enrollment click events
 * @param {Object} course - Course object
 * @param {Object} selectedType - Selected course type
 * @param {Object} additionalData - Additional tracking data
 */
export const trackClickEnroll = (
  course,
  selectedType = null,
  additionalData = {}
) => {
  const type = selectedType || course.types?.[0] || {};

  pushToDataLayer({
    event: "click_enroll",
    course_id: course._id,
    course_name: course.title,
    course_price: type.price || 0,
    sale_price: type.salePrice || null,
    currency: "BDT",
    course_type: type.mode || "online",
    payment_type: course.paymentType || "paid",
    page_path: window.location.pathname,
    ...additionalData,
  });
};

/**
 * Track add to cart events (for shop products)
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity added
 * @param {Object} additionalData - Additional tracking data
 */
export const trackAddToCart = (product, quantity = 1, additionalData = {}) => {
  console.log("trackAddToCart called with:", {
    product,
    quantity,
    additionalData,
  });

  const eventData = {
    event: "add_to_cart",
    product_id: product._id,
    product_name: product.title,
    product_price: product.price || 0,
    old_price: product.oldPrice || null,
    currency: "BDT",
    product_category: product.category?.title || "General",
    quantity: quantity,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    ...additionalData,
  };

  console.log("trackAddToCart eventData:", eventData);
  pushToDataLayer(eventData);
};

/**
 * Track buy now events (direct purchase from product page)
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity purchased
 * @param {Object} additionalData - Additional tracking data
 */
export const trackBuyNow = (product, quantity = 1, additionalData = {}) => {
  console.log("trackBuyNow called with:", {
    product,
    quantity,
    additionalData,
  });

  const eventData = {
    event: "buy_now",
    product_id: product._id,
    product_name: product.title,
    product_price: product.price || 0,
    old_price: product.oldPrice || null,
    currency: "BDT",
    product_category: product.category?.title || "General",
    quantity: quantity,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    ...additionalData,
  };

  console.log("trackBuyNow eventData:", eventData);
  pushToDataLayer(eventData);
};

/**
 * Track checkout initiation events
 * @param {Array} items - Cart items
 * @param {number} totalValue - Total cart value
 * @param {Object} additionalData - Additional tracking data
 */
export const trackCheckout = (
  items = [],
  totalValue = 0,
  additionalData = {}
) => {
  console.log("trackCheckout called with:", {
    items,
    totalValue,
    additionalData,
  });

  const eventData = {
    event: "checkout",
    items: items.map((item) => ({
      item_id: item.product?._id || item._id,
      item_name: item.product?.title || item.title,
      price: item.product?.price || item.price || 0,
      quantity: item.quantity || 1,
    })),
    value: totalValue,
    currency: "BDT",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    ...additionalData,
  };

  console.log("trackCheckout eventData:", eventData);
  pushToDataLayer(eventData);
};

/**
 * Track purchase completion events
 * @param {string} transactionId - Transaction ID
 * @param {Array} items - Purchased items
 * @param {number} totalValue - Total purchase value
 * @param {string} paymentMethod - Payment method used
 * @param {string} couponCode - Coupon code if used
 * @param {Object} additionalData - Additional tracking data
 */
export const trackPurchase = (
  transactionId,
  items = [],
  totalValue = 0,
  paymentMethod = "unknown",
  couponCode = null,
  additionalData = {}
) => {
  console.log("trackPurchase called with:", {
    transactionId,
    items,
    totalValue,
    paymentMethod,
    couponCode,
    additionalData,
  });

  const eventData = {
    event: "purchase",
    transaction_id: transactionId,
    items: items.map((item) => ({
      item_id: item.product?._id || item._id,
      item_name: item.product?.title || item.title,
      price: item.product?.price || item.price || 0,
      quantity: item.quantity || 1,
    })),
    value: totalValue,
    currency: "BDT",
    payment_method: paymentMethod,
    coupon_code: couponCode,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    ...additionalData,
  };

  console.log("trackPurchase eventData:", eventData);
  pushToDataLayer(eventData);
};

/**
 * Track user registration events
 * @param {string} userId - User ID
 * @param {string} userType - Type of user (learner, mentor, admin)
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} phoneNum - User's phone number
 * @param {Object} additionalData - Additional tracking data
 */
export const trackSignUp = (
  userId,
  userType = "learner",
  name = "",
  email = "",
  phoneNum = "",
  additionalData = {}
) => {
  console.log("trackSignUp called with:", {
    userId,
    userType,
    name,
    email,
    phoneNum,
    additionalData,
  });

  const eventData = {
    event: "sign_up",
    user_id: userId,
    user_type: userType,
    name: name,
    email: email,
    phone_num: phoneNum,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    ...additionalData,
  };

  console.log("trackSignUp eventData:", eventData);
  pushToDataLayer(eventData);
};

/**
 * Track user login events
 * @param {string} userId - User ID
 * @param {string} userType - Type of user (learner, mentor, admin)
 * @param {string} loginMethod - Method used for login (email, phone, social)
 * @param {Object} additionalData - Additional tracking data
 */
export const trackLogin = (
  userId,
  userType = "learner",
  loginMethod = "email",
  additionalData = {}
) => {
  console.log("trackLogin called with:", {
    userId,
    userType,
    loginMethod,
    additionalData,
  });

  const eventData = {
    event: "login",
    user_id: userId,
    user_type: userType,
    login_method: loginMethod,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    ...additionalData,
  };

  console.log("trackLogin eventData:", eventData);
  pushToDataLayer(eventData);
};

/**
 * Track custom events
 * @param {string} eventName - Event name
 * @param {Object} eventData - Event data
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  pushToDataLayer({
    event: eventName,
    page_path: window.location.pathname,
    ...eventData,
  });
};

/**
 * Get UTM parameters from URL
 * @returns {Object} UTM parameters
 */
export const getUTMParameters = () => {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_term: urlParams.get("utm_term"),
    utm_content: urlParams.get("utm_content"),
  };
};

/**
 * Enhanced page view tracking with UTM parameters
 * @param {string} pagePath - Current page path
 * @param {string} pageTitle - Page title
 */
export const trackEnhancedPageView = (pagePath, pageTitle) => {
  const utmParams = getUTMParameters();
  trackPageView(pagePath, pageTitle, utmParams);
};
