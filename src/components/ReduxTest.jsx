
import { useSelector, useDispatch } from "react-redux";

import { addTask } from "../features/tasks/taskSlice";

function ReduxTest() {
  const taskList = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  function handleAddTask() {
    const newTask = {
      id: Date.now(),
      title: "Learn Redux Toolkit",
      subject: "React",
      time: "09:00 AM",
      priority: "High",
      completed: false
    };

    dispatch(addTask(newTask));
  }

  return (
    <div>
      <h2>Redux Test</h2>

      <p>Total Tasks: {taskList.length}</p>

      <button onClick={handleAddTask}>
        Add Redux Task
      </button>

      {taskList.map(task => (
        <p key={task.id}>{task.title}</p>
      ))}
    </div>
  );
}

export default ReduxTest;
