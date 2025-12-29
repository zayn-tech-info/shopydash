/**
 * Sanitizes string input to prevent NoSQL injection
 * @param {any} input - The input to sanitize
 * @returns {string|null} - Sanitized string or null
 */
const sanitizeString = (input) => {
  if (input === null || input === undefined) {
    return null;
  }

  // Convert to string and remove any MongoDB operators
  const str = String(input);
  
  // Remove potential MongoDB operators and special characters
  const sanitized = str.replace(/[${}]/g, "");
  
  return sanitized;
};

/**
 * Sanitizes an object to prevent NoSQL injection
 * @param {object} obj - The object to sanitize
 * @returns {object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        return sanitizeString(item);
      } else if (typeof item === "object" && item !== null) {
        return sanitizeObject(item);
      }
      return item;
    });
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip keys that start with $ (MongoDB operators)
    if (key.startsWith("$")) {
      continue;
    }

    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => {
        if (typeof item === "string") {
          return sanitizeString(item);
        } else if (typeof item === "object" && item !== null) {
          return sanitizeObject(item);
        }
        return item;
      });
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Validates and sanitizes search query
 * @param {string} query - Search query
 * @returns {string} - Sanitized query
 */
const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== "string") {
    return "";
  }

  // Remove special characters that could be exploited
  // Keep alphanumeric, spaces, and basic safe punctuation (no @ to prevent email injection)
  return query
    .replace(/[^\w\s\-.,]/gi, "")
    .trim()
    .slice(0, 200); // Limit length
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  sanitizeSearchQuery,
};
