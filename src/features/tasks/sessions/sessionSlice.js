
import { createSlice } from "@reduxjs/toolkit";

// Load saved session history
function loadSessions() {
  try {
    const savedSessions = localStorage.getItem(
      "studyflow_sessions"
    );

    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);

      return Array.isArray(parsedSessions)
        ? parsedSessions
        : [];
    }

    return [];
  } catch (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }
}

const initialState = {
  status: "idle",
  selectedTaskId: null,

  // Accumulated time in milliseconds
  elapsedMs: 0,

  // Timestamp of the current running period
  startedAt: null,

  // Original session start time
  sessionStartedAt: null,

  // Completed sessions
  sessions: loadSessions()
};

const sessionSlice = createSlice({
  name: "sessions",

  initialState,

  reducers: {

    // Start a new session
    startSession: (state, action) => {
      if (state.status !== "idle") return;

      const { taskId, now, startedAtISO } = action.payload;

      state.status = "running";
      state.selectedTaskId = taskId;
      state.elapsedMs = 0;
      state.startedAt = now;
      state.sessionStartedAt = startedAtISO;
    },

    // Pause the session
    pauseSession: (state, action) => {
      if (state.status !== "running") return;

      state.elapsedMs += action.payload.now - state.startedAt;

      state.startedAt = null;
      state.status = "paused";
    },

    // Resume the session
    resumeSession: (state, action) => {
      if (state.status !== "paused") return;

      state.startedAt = action.payload.now;
      state.status = "running";
    },

    // Stop and save the session
    stopSession: (state, action) => {
      if (state.status === "idle") return;

      const { now, completedAt, sessionId } = action.payload;

      let finalDuration = state.elapsedMs;

      if (state.status === "running") {
        finalDuration += now - state.startedAt;
      }

      // Save only sessions with tracked time
      if (finalDuration > 0) {
        state.sessions.push({
          id: sessionId,
          taskId: state.selectedTaskId,
          durationMs: finalDuration,
          startedAt: state.sessionStartedAt,
          completedAt
        });
      }

      // Reset timer
      state.status = "idle";
      state.selectedTaskId = null;
      state.elapsedMs = 0;
      state.startedAt = null;
      state.sessionStartedAt = null;
    }
  }
});

export const {
  startSession,
  pauseSession,
  resumeSession,
  stopSession
} = sessionSlice.actions;

export default sessionSlice.reducer;
