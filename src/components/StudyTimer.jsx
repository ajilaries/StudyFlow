
import { useState } from "react";

import { useTasks } from "../context/useTasks";
import { useStudySession } from "../context/useStudySession";

function StudyTimer() {
  const { taskList } = useTasks();

  const {
    status,
    selectedTaskId,
    elapsedMs,
    startSession,
    pauseSession,
    resumeSession,
    stopSession
  } = useStudySession();

  const [taskId, setTaskId] = useState("");

  // Convert milliseconds into HH:MM:SS
  const totalSeconds = Math.floor(elapsedMs / 1000);

  const hours = String(
    Math.floor(totalSeconds / 3600)
  ).padStart(2, "0");

  const minutes = String(
    Math.floor((totalSeconds % 3600) / 60)
  ).padStart(2, "0");

  const seconds = String(
    totalSeconds % 60
  ).padStart(2, "0");

  // Start studying
  function handleStart() {
    if (!taskId) return;

    startSession(Number(taskId));
  }

  // Stop and save will be connected to session history next
function handleStop() {
  stopSession();
}
  const selectedTask = taskList.find(
    task => task.id === selectedTaskId
  );

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
            onChange={(event) => setTaskId(event.target.value)}
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
            onClick={pauseSession}
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
            onClick={resumeSession}
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
