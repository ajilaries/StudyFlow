
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <div className="task-item">

      <div className="task-left">

        <button
          type="button"
          className={`task-checkbox ${
            task.completed ? "checked" : ""
          }`}
          onClick={() => onToggle(task.id)}
          aria-label={`Toggle ${task.title}`}
        >
          {task.completed ? "✓" : ""}
        </button>

        <div>
          <h4 className={task.completed ? "completed" : ""}>
            {task.title}
          </h4>

          <p>
            {task.subject} · {task.time}
          </p>
        </div>

      </div>

      <div className="task-actions">

        <span className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>

        <button
          type="button"
          className="edit-button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
        >
          ✕
        </button>

      </div>

    </div>
  );
}

export default TaskItem;
