
/**
 * Returns the 42 dates required for a monthly calendar grid.
 * The calendar starts on Monday and ends on Sunday.
 */
export function getCalendarDays(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of the selected month
  const firstDayOfMonth = new Date(year, month, 1);

  // Last day of the selected month
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Convert Sunday-based index to Monday-based index
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  // Total days in the selected month
  const totalDays = lastDayOfMonth.getDate();

  // Calculate the number of calendar cells required
  const totalCells = Math.ceil(
    (startingDayIndex + totalDays) / 7
  ) * 7;

  // Start date for the calendar grid
  const gridStartDate = new Date(year, month, 1 - startingDayIndex);

  // Generate all calendar dates
  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(gridStartDate);

    date.setDate(gridStartDate.getDate() + index);

    return date;
  });
}

/**
 * Checks whether two dates belong to the same day.
 */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Checks whether a date belongs to the displayed month.
 */
export function isSameMonth(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * Converts a Date into YYYY-MM-DD format
 * using local date values.
 */
export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
