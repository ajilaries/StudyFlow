
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  startSession,
  pauseSession,
  resumeSession,
  stopSession
} from "../features/tasks/sessions/sessionSlice";

function StudyTimer() {
  const dispatch = useDispatch();

  // Read tasks from Redux
  const taskList = useSelector(state => state.tasks);

  // Read session state from Redux
  const {
    status,
    selectedTaskId,
    elapsedMs,
    startedAt
  } = useSelector(state => state.sessions);

  // Local UI state
  const [taskId, setTaskId] = useState("");

  // Current timestamp for timer display
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Update current time every second
  useEffect(() => {
    if (status !== "running") return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Calculate elapsed time
  const currentElapsedMs =
    status === "running" && startedAt !== null
      ? elapsedMs + (currentTime - startedAt)
      : elapsedMs;

  // Convert milliseconds into HH:MM:SS
  const totalSeconds = Math.floor(currentElapsedMs / 1000);

  const hours = String(
    Math.floor(totalSeconds / 3600)
  ).padStart(2, "0");

  const minutes = String(
    Math.floor((totalSeconds % 3600) / 60)
  ).padStart(2, "0");

  const seconds = String(
    totalSeconds % 60
  ).padStart(2, "0");

  // Find selected task
  const selectedTask = taskList.find(
    task => task.id === selectedTaskId
  );

  // Start session
  function handleStart() {
    if (!taskId) return;

    const now = Date.now();

    dispatch(startSession({
      taskId: Number(taskId),
      now,
      startedAtISO: new Date(now).toISOString()
    }));

    setCurrentTime(now);
  }

  // Pause session
  function handlePause() {
    const now = Date.now();

    dispatch(pauseSession({ now }));

    setCurrentTime(now);
  }

  // Resume session
  function handleResume() {
    const now = Date.now();

    dispatch(resumeSession({ now }));

    setCurrentTime(now);
  }

  // Stop session
  function handleStop() {
    const now = Date.now();

    dispatch(stopSession({
      now,
      completedAt: new Date(now).toISOString(),
      sessionId: now
    }));

    setTaskId("");
    setCurrentTime(now);
  }

  return (
    <section className="study-timer">

      <div className="timer-header">
        <div>
          <h2>Study Timer</h2>
          <p>Track your focused learning time.</p>
        </div>

        <span className={`timer-status ${status}`}>
          {status === "idle" ? "Not started" : status}
        </span>
      </div>

      <div className="timer-display">
        <h1>
          {hours}:{minutes}:{seconds}
        </h1>

        <p>
          {selectedTask
            ? `Studying: ${selectedTask.title}`
            : "Choose a task to begin"}
        </p>
      </div>

      {status === "idle" && (
        <div className="timer-controls">

          <select
            value={taskId}
            onChange={event => setTaskId(event.target.value)}
          >
            <option value="">Select a task</option>

            {taskList.map(task => (
              <option
                key={task.id}
                value={task.id}
                disabled={task.completed}
              >
                {task.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="primary-button"
            onClick={handleStart}
            disabled={!taskId || taskList.length === 0}
          >
            Start Studying
          </button>

        </div>
      )}

      {status === "running" && (
        <div className="timer-controls">

          <button
            type="button"
            className="cancel-button"
            onClick={handlePause}
          >
            Pause
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleStop}
          >
            Stop Session
          </button>

        </div>
      )}

      {status === "paused" && (
        <div className="timer-controls">

          <button
            type="button"
            className="primary-button"
            onClick={handleResume}
          >
            Resume
          </button>

          <button
            type="button"
            className="cancel-button"
            onClick={handleStop}
          >
            Stop Session
          </button>

        </div>
      )}

    </section>
  );
}

export default StudyTimer;