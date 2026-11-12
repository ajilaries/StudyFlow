import {
  useState,
  useEffect
} from "react";

import  TaskContext  from "./TaskContext.js";
import { tasks as initialTasks } from "../data/tasks";

export function TaskProvider({ children }) {

  const [taskList, setTaskList] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("studyflow_tasks");

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        return Array.isArray(parsedTasks) ? parsedTasks : initialTasks;
      }

      return initialTasks;
    } catch (error) {
      console.error("Failed to load tasks:", error);
      return initialTasks;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "studyflow_tasks",
        JSON.stringify(taskList)
      );
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  }, [taskList]);

  function toggleTask(taskId) {
    setTaskList((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

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

  function updateTask(taskId, updatedData) {
    setTaskList((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: updatedData.title.trim(),
              subject: updatedData.subject.trim(),
              time: updatedData.time.trim() || "Not scheduled",
              priority: updatedData.priority
            }
          : task
      )
    );
  }

  function deleteTask(taskId) {
    setTaskList((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  }

  const value = {
    taskList,
    toggleTask,
    addTask,
    updateTask,
    deleteTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}