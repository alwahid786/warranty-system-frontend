/**
 * Centralized filtering utilities to avoid repetition across components
 */

/**
 * Normalizes MongoDB ObjectIds, strings, and other ID formats for comparison
 */
export const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.$oid) return value.$oid;
  if (typeof value?.toString === "function") return value.toString();

  return String(value);
};

/**
 * Parses date strings in MM/DD/YY or MM/DD/YYYY format
 */
export const parseStringDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split("/");

  if (parts.length !== 3) return null;

  let [month, day, year] = parts;

  if (year.length === 2) {
    year = `20${year}`;
  }

  const date = new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  );

  return isNaN(date.getTime()) ? null : date;
};

/**
 * Checks if a date is within a given range (inclusive)
 */
export const isDateInRange = (date, fromDate, toDate) => {
  if (!date) return true;

  let targetDate;

  if (typeof date === "string") {
    targetDate = parseStringDate(date);
    if (!targetDate || isNaN(targetDate.getTime())) {
      targetDate = new Date(date);
    }
  } else {
    targetDate = new Date(date);
  }

  if (!targetDate || isNaN(targetDate.getTime())) return true;

  if (fromDate) {
    const from = new Date(fromDate);

    from.setHours(0, 0, 0, 0);
    if (targetDate < from) return false;
  }

  if (toDate) {
    const to = new Date(toDate);

    to.setHours(23, 59, 59, 999);
    if (targetDate > to) return false;
  }

  return true;
};

/**
 * Generic search filter
 */
export const matchesSearch = (item, searchValue, searchType) => {
  if (!searchValue) return true;
  const val = searchValue.toLowerCase();

  if (searchType === "companyName") {
    const comp = String(item.companyName || "").toLowerCase();
    const store = String(item.storeName || "").toLowerCase();
    const warranty = String(item.warrantyCompany || "").toLowerCase();

    return comp.includes(val) || store.includes(val) || warranty.includes(val);
  }

  const fieldVal = String(item[searchType] || "").toLowerCase();

  return fieldVal.includes(val);
};
