
import { useMemo, useState } from "react";

import { useTasks } from "../context/useTasks";
import TaskItem from "../components/TaskItem";

function Tasks() {
  const {
    taskList,
    addTask,
    updateTask,
    toggleTask,
    deleteTask
  } = useTasks();

  // UI states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    time: "",
    priority: "Medium"
  });

  const [error, setError] = useState("");

  // Task statistics
  const totalTasks = taskList.length;

  const completedTasks = taskList.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  // Search, filter and sort
  const filteredTasks = useMemo(() => {
    let result = [...taskList];

    // Search
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchValue) ||
          task.subject.toLowerCase().includes(searchValue)
      );
    }

    // Filter
    if (filter === "Pending") {
      result = result.filter((task) => !task.completed);
    }

    if (filter === "Completed") {
      result = result.filter((task) => task.completed);
    }

    // Sort
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3
    };

    if (sortBy === "priority") {
      result.sort(
        (a, b) =>
          (priorityOrder[a.priority] ?? 4) -
          (priorityOrder[b.priority] ?? 4)
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [taskList, search, filter, sortBy]);

  // Open add form
  function handleAddClick() {
    setEditingTask(null);

    setFormData({
      title: "",
      subject: "",
      time: "",
      priority: "Medium"
    });

    setError("");
    setShowForm(true);
  }

  // Open edit form
  function handleEdit(task) {
    setEditingTask(task);

    setFormData({
      title: task.title,
      subject: task.subject,
      time:
        task.time === "Not scheduled"
          ? ""
          : task.time,
      priority: task.priority
    });

    setError("");
    setShowForm(true);
  }

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  // Submit form
  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.subject.trim()
    ) {
      setError("Please enter both task title and subject.");
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }

    setShowForm(false);
    setEditingTask(null);
    setError("");
  }

  // Cancel form
  function handleCancel() {
    setShowForm(false);
    setEditingTask(null);
    setError("");
  }

  return (
    <div className="tasks-page">

      {/* Page Header */}
      <div className="welcome-section">
        <div>
          <h1>My Tasks</h1>
          <p>
            Organize your learning and stay productive.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddClick}
        >
          + Add Task
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <p>Total Tasks</p>
            <span className="stat-icon">📚</span>
          </div>
          <h2>{totalTasks}</h2>
          <p className="stat-description">
            All your tasks
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <p>Pending</p>
            <span className="stat-icon">⏳</span>
          </div>
          <h2>{pendingTasks}</h2>
          <p className="stat-description">
            Tasks remaining
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <p>Completed</p>
            <span className="stat-icon">✅</span>
          </div>
          <h2>{completedTasks}</h2>
          <p className="stat-description">
            Tasks finished
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <p>Completion</p>
            <span className="stat-icon">📈</span>
          </div>
          <h2>{completionPercentage}%</h2>
          <p className="stat-description">
            Overall progress
          </p>
        </div>

      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form
          className="task-form"
          onSubmit={handleSubmit}
        >
          <h2>
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>

          {error && (
            <p className="form-error">{error}</p>
          )}

          <label htmlFor="title">Task Title</label>

          <input
            id="title"
            type="text"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
          />

          <label htmlFor="subject">Subject</label>

          <input
            id="subject"
            type="text"
            name="subject"
            placeholder="e.g. Programming"
            value={formData.subject}
            onChange={handleChange}
          />

          <label htmlFor="time">Time</label>

          <input
            id="time"
            type="text"
            name="time"
            placeholder="e.g. 10:00 AM"
            value={formData.time}
            onChange={handleChange}
          />

          <label htmlFor="priority">Priority</label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
            >
              {editingTask ? "Update Task" : "Save Task"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search, Filter and Sort */}
      <div className="tasks-toolbar">

        <input
          type="search"
          className="task-search"
          placeholder="Search by title or subject..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="task-filters">
          {["All", "Pending", "Completed"].map((option) => (
            <button
              key={option}
              type="button"
              className={`filter-button ${
                filter === option ? "active" : ""
              }`}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <select
          className="task-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Sort tasks"
        >
          <option value="default">Default order</option>
          <option value="priority">Priority</option>
          <option value="title">Task name</option>
        </select>

      </div>

      {/* Task List */}
      <div className="tasks-section">

        <div className="section-heading">
          <div>
            <h2>All Tasks</h2>
            <p>
              Showing {filteredTasks.length} of {totalTasks} tasks
            </p>
          </div>
        </div>

        <div className="task-list">

          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <p className="empty-message">
              No tasks found. Try changing your search or filters.
            </p>
          )}

        </div>
      </div>

    </div>
  );
}

export default Tasks;
