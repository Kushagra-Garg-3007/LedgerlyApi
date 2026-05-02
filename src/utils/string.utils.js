/**
 * Clean header text so we can match different column names easily.
 */
function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  normalizeHeader,
};
