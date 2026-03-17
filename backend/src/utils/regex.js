
const escapeRegex = (string) => {
  if (typeof string !== "string") {
    return "";
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


const createSafeRegex = (query, options = "i") => {
  const escaped = escapeRegex(query);
  return { $regex: escaped, $options: options };
};

module.exports = {
  escapeRegex,
  createSafeRegex,
};
