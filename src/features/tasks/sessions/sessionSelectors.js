
import { createSelector } from "@reduxjs/toolkit";

// Get all completed study sessions from Redux
export const selectAllSessions = (state) =>
  state.sessions.sessions;

// Calculate total study time
export const selectTotalStudyTime = createSelector(
  [selectAllSessions],
  (sessions) => {
    return sessions.reduce(
      (total, session) => total + session.durationMs,
      0
    );
  }
);

// Calculate the beginning of the current week (Monday)
function getStartOfWeek(date) {
  const start = new Date(date);

  const day = start.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + difference);
  start.setHours(0, 0, 0, 0);

  return start;
}

// Calculate this week's study time
export const selectWeeklyStudyTime = createSelector(
  [selectAllSessions],
  (sessions) => {
    const now = new Date();

    const weekStart = getStartOfWeek(now);
    const nextWeekStart = new Date(weekStart);

    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    return sessions.reduce((total, session) => {
      const completedDate = new Date(session.completedAt);

      if (
        completedDate >= weekStart &&
        completedDate < nextWeekStart
      ) {
        return total + session.durationMs;
      }

      return total;
    }, 0);
  }
);

// Convert milliseconds into readable study time
export function formatStudyTime(milliseconds) {
  const totalMinutes = Math.floor(milliseconds / 60000);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}
