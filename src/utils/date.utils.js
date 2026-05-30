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

function isValidDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function toDateOnly(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getCurrentMonthRange(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 0),
  };
}

module.exports = {
  getCurrentMonthRange,
  isValidDateOnly,
  parseDate,
  toDateOnly,
};
