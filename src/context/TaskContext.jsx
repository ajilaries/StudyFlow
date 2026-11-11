
import { createContext, useContext, useState, useEffect } from "react";

import { tasks as initialTasks } from "../data/tasks";

// 1. Create Context
const TaskContext = createContext();

// 2. Create Provider
export function TaskProvider({ children }) {

  // Shared task state
  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem("studyflow_tasks");

    return savedTasks
      ? JSON.parse(savedTasks)
      : initialTasks;
  });

  // Save tasks whenever taskList changes
  useEffect(() => {
    localStorage.setItem(
      "studyflow_tasks",
      JSON.stringify(taskList)
    );
  }, [taskList]);

  // Toggle task completion
  function toggleTask(taskId) {
    setTaskList((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // Add a new task
  function addTask(taskData) {
    const newTask = {
      id: Date.now(),
      title: taskData.title.trim(),
      subject: taskData.subject.trim(),
      time: taskData.time.trim() || "Not scheduled",
      priority: taskData.priority,
      completed: false
    };

    setTaskList((currentTasks) => [
      ...currentTasks,
      newTask
    ]);
  }

  // Delete a task
  function deleteTask(taskId) {
    setTaskList((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== taskId
      )
    );
  }

  // Values shared with other components
  const value = {
    taskList,
    toggleTask,
    addTask,
    deleteTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

// 3. Custom Hook
export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTasks must be used inside TaskProvider"
    );
  }

  return context;
}
