
import { configureStore } from "@reduxjs/toolkit";

import taskReducer from "../features/tasks/taskSlice";
import sessionReducer from "../features/tasks/sessions/sessionSlice"

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    sessions:sessionReducer
  }
});
