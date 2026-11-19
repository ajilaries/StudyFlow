
import { useState } from "react";
import { useSelector } from "react-redux";

import { selectAllTasks } from "../features/tasks/taskSelectors";

import {
  getCalendarDays,
  isSameDay,
  isSameMonth,
  formatDateKey
} from "../utils/calenderUtils";

function Calendar() {
  // Tasks from Redux
  const taskList = useSelector(selectAllTasks);

  // Today's date
  const today = new Date();

  // Currently displayed month
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Selected date
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Calendar grid dates
  const calendarDays = getCalendarDays(currentDate);

  // Month and year heading
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  // Tasks for selected date
  const selectedDateTasks = taskList.filter((task) => {
    return task.date === formatDateKey(selectedDate);
  });

  // Navigate to previous month
  function handlePreviousMonth() {
    setCurrentDate((previousDate) => {
      return new Date(
        previousDate.getFullYear(),
        previousDate.getMonth() - 1,
        1
      );
    });
  }

  // Navigate to next month
  function handleNextMonth() {
    setCurrentDate((previousDate) => {
      return new Date(
        previousDate.getFullYear(),
        previousDate.getMonth() + 1,
        1
      );
    });
  }

  // Go back to today
  function handleToday() {
    const now = new Date();

    setCurrentDate(now);
    setSelectedDate(now);
  }

  // Tasks scheduled on a date
  function getTasksForDate(date) {
    const dateKey = formatDateKey(date);

    return taskList.filter((task) => task.date === dateKey);
  }

  return (
    <div className="calendar-page">

      {/* Calendar Header */}
      <section className="calendar-header">
        <div>
          <h1>Calendar</h1>
          <p>Plan and organize your study schedule.</p>
        </div>

        <button
          className="primary-button"
          onClick={handleToday}
        >
          Today
        </button>
      </section>

      {/* Calendar Card */}
      <section className="calendar-card">

        {/* Month Navigation */}
        <div className="calendar-toolbar">
          <button
            className="calendar-nav-button"
            onClick={handlePreviousMonth}
            aria-label="Previous month"
          >
            ‹
          </button>

          <h2>{monthYear}</h2>

          <button
            className="calendar-nav-button"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Weekday Names */}
        <div className="calendar-grid calendar-weekdays">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            )
          )}
        </div>

        {/* Calendar Dates */}
        <div className="calendar-grid calendar-dates">
          {calendarDays.map((date, index) => {
            const isToday = isSameDay(date, today);

            const isSelected = isSameDay(date, selectedDate);

            const isCurrentMonth = isSameMonth(
              date,
              currentDate
            );

            const dayTasks = getTasksForDate(date);

            return (
              <button
                key={`${formatDateKey(date)}-${index}`}
                type="button"
                className={`calendar-day
                  ${isToday ? "today" : ""}
                  ${isSelected ? "selected" : ""}
                  ${!isCurrentMonth ? "other-month" : ""}
                  ${dayTasks.length > 0 ? "has-tasks" : ""}
                `}
                onClick={() => setSelectedDate(date)}
              >
                <span className="calendar-day-number">
                  {date.getDate()}
                </span>

                {/* Task indicators */}
                {dayTasks.length > 0 && (
                  <span className="calendar-task-indicators">
                    {dayTasks.slice(0, 3).map((task) => (
                      <span
                        key={task.id}
                        className={`calendar-task-dot ${
                          task.completed ? "completed" : ""
                        }`}
                      />
                    ))}

                    {dayTasks.length > 3 && (
                      <span className="calendar-more-tasks">
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Date Tasks */}
      <section className="selected-date-section">
        <div className="selected-date-header">
          <div>
            <h2>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric"
              })}
            </h2>

            <p>
              {selectedDateTasks.length}{" "}
              {selectedDateTasks.length === 1 ? "task" : "tasks"} scheduled
            </p>
          </div>
        </div>

        <div className="selected-date-tasks">
          {selectedDateTasks.length === 0 ? (
            <div className="calendar-empty-state">
              <p>No tasks scheduled for this date.</p>
            </div>
          ) : (
            selectedDateTasks.map((task) => (
              <div className="calendar-task-card" key={task.id}>
                <div className="calendar-task-info">
                  <h3>{task.title}</h3>
                  <p>{task.subject}</p>

                  <span className="calendar-task-time">
                    {task.time || "No time set"}
                  </span>
                </div>

                <div className="calendar-task-meta">
                  <span
                    className={`priority-badge priority-${(
                      task.priority || "medium"
                    ).toLowerCase()}`}
                  >
                    {task.priority || "Medium"}
                  </span>

                  <span
                    className={`calendar-task-status ${
                      task.completed ? "completed" : "pending"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Calendar;
