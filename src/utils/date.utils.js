/**
 * Convert a date value from Excel into a JavaScript Date object.
 * Ensures that timezone differences do not shift the date by setting time to noon UTC.
 * Return null if the value is missing or not a valid date.
 */
function parseDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  let year, month, day;

  if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
    year = dateValue.getFullYear();
    month = dateValue.getMonth(); // getMonth() returns 0-11
    day = dateValue.getDate();
  } else {
    const text = String(dateValue).trim();
    // Try day-first format first (DD-MM-YYYY or DD/MM/YYYY)
    const dayFirstMatch = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (dayFirstMatch) {
      day = Number(dayFirstMatch[1]);
      month = Number(dayFirstMatch[2]) - 1; // convert to 0-11
      const yearRaw = Number(dayFirstMatch[3]);
      year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;
      // Verify it's a valid date
      const testDate = new Date(year, month, day);
      if (
        Number.isNaN(testDate.getTime()) ||
        testDate.getDate() !== day ||
        testDate.getMonth() !== month ||
        testDate.getFullYear() !== year
      ) {
        // If day-first is invalid, try month-first
        month = Number(dayFirstMatch[1]) - 1;
        day = Number(dayFirstMatch[2]);
        const testDate2 = new Date(year, month, day);
        if (
          Number.isNaN(testDate2.getTime()) ||
          testDate2.getDate() !== day ||
          testDate2.getMonth() !== month ||
          testDate2.getFullYear() !== year
        ) {
          return null;
        }
      }
    } else {
      // Use JavaScript Date parser for other formats
      const parsed = new Date(text);
      if (Number.isNaN(parsed.getTime())) {
        return null;
      }
      year = parsed.getFullYear();
      month = parsed.getMonth();
      day = parsed.getDate();
    }
  }

  // Create a Date object at noon UTC to prevent timezone shifts from changing the date
  return new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
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
