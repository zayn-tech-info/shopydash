
const sanitizeString = (input) => {
  if (input === null || input === undefined) {
    return null;
  }

  
  const str = String(input);
  
  
  const sanitized = str.replace(/[${}]/g, "");
  
  return sanitized;
};


const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  
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


const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== "string") {
    return "";
  }

  
  
  return query
    .replace(/[^\w\s\-.,]/gi, "")
    .trim()
    .slice(0, 200); 
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  sanitizeSearchQuery,
};
