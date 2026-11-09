
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import TaskItem from "../components/TaskItem";

import { tasks as initialTasks } from "../data/tasks";

function Dashboard() {

  // Main task state
  const [taskList, setTaskList] = useState(initialTasks);

  // Form visibility
  const [showForm, setShowForm] = useState(false);

  // Form input state
  const [newTask, setNewTask] = useState({
    title: "",
    subject: "",
    time: "",
    priority: "Medium"
  });

  // Calculate statistics
  const totalTasks = taskList.length;

  const completedTasks = taskList.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

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

  // Handle form inputs
  function handleChange(event) {

    const { name, value } = event.target;

    setNewTask((previousTask) => ({
      ...previousTask,
      [name]: value
    }));

  }

  // Add new task
  function handleAddTask(event) {

    event.preventDefault();

    if (!newTask.title.trim() || !newTask.subject.trim()) {
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title.trim(),
      subject: newTask.subject.trim(),
      time: newTask.time || "Not scheduled",
      priority: newTask.priority,
      completed: false
    };

    setTaskList((currentTasks) => [
      ...currentTasks,
      task
    ]);

    setNewTask({
      title: "",
      subject: "",
      time: "",
      priority: "Medium"
    });

    setShowForm(false);

  }

  // Delete task
  function deleteTask(taskId) {

    setTaskList((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== taskId
      )
    );

  }

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Header />

        <section className="welcome-section">

          <div>
            <h1>Welcome back, Ajil! 👋</h1>
            <p>Let's make today productive.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => setShowForm(!showForm)}
          >
            + Add New Task
          </button>

        </section>

        {/* Add Task Form */}

        {showForm && (

          <form
            className="task-form"
            onSubmit={handleAddTask}
          >

            <h2>Create New Task</h2>

            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={newTask.title}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={newTask.subject}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="time"
              placeholder="Time (e.g. 10:00 AM)"
              value={newTask.time}
              onChange={handleChange}
            />

            <select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div className="form-actions">

              <button type="submit" className="primary-button">
                Save Task
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

            </div>

          </form>

        )}

        {/* Dynamic Statistics */}

        <section className="stats-grid">

          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon="📚"
            description="All your tasks"
          />

          <StatCard
            title="Completed"
            value={completedTasks}
            icon="✓"
            description="Tasks finished"
          />

          <StatCard
            title="Pending"
            value={pendingTasks}
            icon="◷"
            description="Tasks remaining"
          />

          <StatCard
            title="Study Hours"
            value="32h"
            icon="⌚"
            description="This month"
          />

        </section>

        {/* Task List */}

        <section className="dashboard-content">

          <div className="tasks-section">

            <div className="section-heading">

              <div>
                <h2>Today's Tasks</h2>
                <p>Your scheduled activities</p>
              </div>

              <button className="text-button">
                View All
              </button>

            </div>

            <div className="task-list">

              {taskList.length === 0 ? (

                <p className="empty-message">
                  No tasks available. Add your first task!
                </p>

              ) : (

                taskList.map((task) => (

                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />

                ))

              )}

            </div>

          </div>

          <div className="progress-section">

            <h2>Weekly Progress</h2>
            <p>Your learning activity this week</p>

            <div className="progress-circle">

              <div className="progress-inner">
                <h2>75%</h2>
                <span>Completed</span>
              </div>

            </div>

            <div className="progress-info">
              <span>Weekly goal</span>
              <strong>15 / 20 hours</strong>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
