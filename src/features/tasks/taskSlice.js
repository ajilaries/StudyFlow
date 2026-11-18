
import { createSlice } from "@reduxjs/toolkit";

const initialState = loadTasks;

function loadTasks(){
  try{
    const savedTasks=localStorage.getItem("studyflow_tasks");

    if(savedTasks){
      const parsedTasks=JSON.parse(savedTasks);

      return Array.isArray(parsedTasks)? parsedTasks:[];

    }

    return [];


  }catch(error){
    console.error("Failed to load tasks",error);
    return [];
  }
}

const taskSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {

    // Create task
    addTask: {
      reducer: (state, action) => {
        state.push(action.payload);
      },

      prepare: (taskData) => {
        return {
          payload: {
            id: Date.now(),
            title: taskData.title.trim(),
            subject: taskData.subject.trim(),
            time: taskData.time.trim() || "Not scheduled",
            priority: taskData.priority,
            completed: false
          }
        };
      }
    },

    // Update task
    updateTask: (state, action) => {
      const { taskId, updatedData } = action.payload;

      const task = state.find(
        (task) => task.id === taskId
      );

      if (task) {
        task.title = updatedData.title.trim();
        task.subject = updatedData.subject.trim();
        task.time = updatedData.time.trim() || "Not scheduled";
        task.priority = updatedData.priority;
      }
    },

    // Toggle completion
    toggleTask: (state, action) => {
      const task = state.find(
        (task) => task.id === action.payload
      );

      if (task) {
        task.completed = !task.completed;
      }
    },

    // Delete task
    deleteTask: (state, action) => {
      return state.filter(
        (task) => task.id !== action.payload
      );
    }
  }
});

export const {
  addTask,
  updateTask,
  toggleTask,
  deleteTask
} = taskSlice.actions;

export default taskSlice.reducer;
