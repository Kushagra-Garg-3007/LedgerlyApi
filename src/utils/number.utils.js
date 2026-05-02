/**
 * Convert amount text/number into a clean positive number.
 * Return null when the value is empty, invalid, or zero.
 */
function parseAmount(amountValue) {
  if (amountValue === null || amountValue === undefined || amountValue === "") {
    return null;
  }

  const numericAmount = Number(String(amountValue).replace(/,/g, "").trim());
  if (Number.isNaN(numericAmount) || numericAmount === 0) {
    return null;
  }
  return Math.abs(numericAmount);
}

module.exports = {
  parseAmount,
};
