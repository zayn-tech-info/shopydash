/**
 * Format a number as Nigerian Naira currency
 */
export const formatCurrency = (amount) => {
  if (amount == null) return "₦0.00";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string to readable format
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format a date string to include time
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Truncate text to specified length
 */
export const truncate = (str, len = 20) => {
  if (!str) return "";
  return str.length > len ? `${str.substring(0, len)}...` : str;
};

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format large numbers compactly
 */
export const formatNumber = (num) => {
  if (num == null) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};
