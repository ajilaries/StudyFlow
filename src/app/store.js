
import { configureStore } from "@reduxjs/toolkit";

import taskReducer from "../features/tasks/taskSlice";
import sessionReducer from "../features/tasks/sessions/sessionSlice";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    sessions: sessionReducer
  }
});

// Keep track of previous state references
let previousTasks = store.getState().tasks;
let previousSessions = store.getState().sessions.sessions;

// Listen for Redux state changes
store.subscribe(() => {
  const state = store.getState();

  // Save tasks when they change
  if (state.tasks !== previousTasks) {
    previousTasks = state.tasks;

    try {
      localStorage.setItem(
        "studyflow_tasks",
        JSON.stringify(state.tasks)
      );
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  }

  // Save sessions when session history changes
  if (state.sessions.sessions !== previousSessions) {
    previousSessions = state.sessions.sessions;

    try {
      localStorage.setItem(
        "studyflow_sessions",
        JSON.stringify(state.sessions.sessions)
      );
    } catch (error) {
      console.error("Failed to save sessions:", error);
    }
  }
});
