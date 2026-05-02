/**
 * Convert a date value from Excel into a JavaScript Date.
 * Return null if the value is missing or not a valid date.
 */
function parseDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
    return dateValue;
  }

  const text = String(dateValue).trim();
  const dayFirstMatch = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dayFirstMatch) {
    const day = Number(dayFirstMatch[1]);
    const month = Number(dayFirstMatch[2]);
    const yearRaw = Number(dayFirstMatch[3]);
    const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;
    const parsedDayFirst = new Date(year, month - 1, day);
    if (
      !Number.isNaN(parsedDayFirst.getTime()) &&
      parsedDayFirst.getDate() === day &&
      parsedDayFirst.getMonth() === month - 1 &&
      parsedDayFirst.getFullYear() === year
    ) {
      return parsedDayFirst;
    }
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

module.exports = {
  parseDate,
};
