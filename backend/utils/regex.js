/**
 * Escapes special regex characters to prevent ReDoS attacks
 * @param {string} string - String to escape
 * @returns {string} - Escaped string safe for regex
 */
const escapeRegex = (string) => {
  if (typeof string !== "string") {
    return "";
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Creates a safe regex object for MongoDB queries
 * @param {string} query - Search query
 * @param {string} options - Regex options (default: "i" for case-insensitive)
 * @returns {object} - Safe MongoDB regex object
 */
const createSafeRegex = (query, options = "i") => {
  const escaped = escapeRegex(query);
  return { $regex: escaped, $options: options };
};

module.exports = {
  escapeRegex,
  createSafeRegex,
};
