
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux selectors
import {
  selectAllTasks,
  selectPendingTasks,
  selectTotalTasks,
  selectCompletedCount
} from "../features/tasks/taskSelectors";

// Redux actions
import {
  addTask,
  updateTask,
  toggleTask,
  deleteTask
} from "../features/tasks/taskSlice";

// Components
import StatCard from "../components/StatCard";
import TaskItem from "../components/TaskItem";
import StudyTimer from "../components/StudyTimer";

function Dashboard() {

  // Get task data using Redux selectors
  const taskList = useSelector(selectAllTasks);

  const pendingTaskList = useSelector(selectPendingTasks);

  const totalTasks = useSelector(selectTotalTasks);

  const completedTasks = useSelector(selectCompletedCount);

  // Get Redux dispatch function
  const dispatch = useDispatch();

  // Local UI state
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    date:"",
    time: "",
    priority: "Medium"
  });

  // Task statistics
  const pendingTasks = pendingTaskList.length;

  // Reset form
  function resetForm() {
    setFormData({
      title: "",
      subject: "",
      date:"",
      time: "",
      priority: "Medium"
    });

    setEditingTask(null);
    setShowForm(false);
  }

  // Open add form
  function handleAddClick() {
    setEditingTask(null);

    setFormData({
      title: "",
      subject: "",
      date:"",
      time: "",
      priority: "Medium"
    });

    setShowForm(true);
  }

  // Open edit form
  function handleEdit(task) {
    setEditingTask(task);

    setFormData({
      title: task.title,
      date:task.date,
      subject: task.subject,
      time: task.time === "Not scheduled" ? "" : task.time,
      priority: task.priority
    });

    setShowForm(true);
  }

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }

  // Submit add/edit form
  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim() || !formData.subject.trim()) {
      return;
    }

    if (editingTask) {
      dispatch(
        updateTask({
          taskId: editingTask.id,
          updatedData: formData
        })
      );
    } else {
      dispatch(addTask(formData));
    }

    resetForm();
  }

  return (
    <>
      {/* Welcome Section */}
      <section className="welcome-section">
        <div>
          <h1>Welcome back! 👋</h1>
          <p>Let's make today productive.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddClick}
        >
          + Add New Task
        </button>
      </section>

      {/* Study Timer */}
      <StudyTimer />

      {/* Add / Edit Form */}
      {showForm && (
        <form className="task-form" onSubmit={handleSubmit}>
          <h2>
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          />
          <input
            type="text"
            name="time"
            placeholder="Time (e.g. 10:00 AM)"
            value={formData.time}
            onChange={handleChange}
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingTask ? "Update Task" : "Save Task"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Statistics */}
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

      {/* Dashboard Content */}
      <section className="dashboard-content">

        {/* Tasks Section */}
        <div className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>Today's Tasks</h2>
              <p>Your scheduled activities</p>
            </div>
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
                  onToggle={(taskId) =>
                    dispatch(toggleTask(taskId))
                  }
                  onDelete={(taskId) =>
                    dispatch(deleteTask(taskId))
                  }
                  onEdit={handleEdit}
                />
              ))
            )}
          </div>
        </div>

        {/* Weekly Progress */}
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
    </>
  );
}

export default Dashboard;
