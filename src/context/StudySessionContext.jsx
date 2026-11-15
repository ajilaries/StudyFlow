
import {
  createContext,
  useEffect,
  useRef,
  useState
} from "react";

const StudySessionContext = createContext(null);

export function StudySessionProvider({ children }) {

  // Timer state
  const [status, setStatus] = useState("idle");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Load previously saved sessions
  const [sessions, setSessions] = useState(() => {
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
      console.error("Failed to load study sessions:", error);
      return [];
    }
  });

  // Timer references
  const intervalRef = useRef(null);
  const startedAtRef = useRef(null);
  const accumulatedMsRef = useRef(0);
  const sessionStartedAtRef = useRef(null);

  // Save sessions whenever session history changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "studyflow_sessions",
        JSON.stringify(sessions)
      );
    } catch (error) {
      console.error("Failed to save study sessions:", error);
    }
  }, [sessions]);

  // Calculate elapsed time
  function getElapsedTime() {
    if (
      status === "running" &&
      startedAtRef.current !== null
    ) {
      return (
        accumulatedMsRef.current +
        (Date.now() - startedAtRef.current)
      );
    }

    return accumulatedMsRef.current;
  }

  // Start a new session
  function startSession(taskId) {
    if (status !== "idle") return;
    if (taskId === null || taskId === undefined) return;

    const now = Date.now();

    accumulatedMsRef.current = 0;
    startedAtRef.current = now;
    sessionStartedAtRef.current = new Date(now).toISOString();

    setElapsedMs(0);
    setSelectedTaskId(taskId);
    setStatus("running");
  }

  // Pause session
  function pauseSession() {
    if (status !== "running") return;

    const currentElapsed = getElapsedTime();

    accumulatedMsRef.current = currentElapsed;
    startedAtRef.current = null;

    setElapsedMs(currentElapsed);
    setStatus("paused");
  }

  // Resume session
  function resumeSession() {
    if (status !== "paused") return;

    startedAtRef.current = Date.now();

    setStatus("running");
  }

  // Stop and save session
  function stopSession() {
    if (status === "idle") return null;

    const finalDuration = getElapsedTime();

    const session = {
      id: Date.now(),
      taskId: selectedTaskId,
      durationMs: finalDuration,
      startedAt: sessionStartedAtRef.current,
      completedAt: new Date().toISOString()
    };

    // Save only sessions with some tracked time
    if (finalDuration > 0) {
      setSessions(currentSessions => [
        ...currentSessions,
        session
      ]);
    }

    // Reset timer
    accumulatedMsRef.current = 0;
    startedAtRef.current = null;
    sessionStartedAtRef.current = null;

    setElapsedMs(0);
    setSelectedTaskId(null);
    setStatus("idle");

    return session;
  }

  // Update display every second while running
  useEffect(() => {
    if (status !== "running") return;

    intervalRef.current = setInterval(() => {
      const elapsed =
        accumulatedMsRef.current +
        (Date.now() - startedAtRef.current);

      setElapsedMs(elapsed);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [status]);

  const value = {
    status,
    selectedTaskId,
    elapsedMs,
    sessions,
    startSession,
    pauseSession,
    resumeSession,
    stopSession
  };

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
}

export default StudySessionContext;
