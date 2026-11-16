
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";

import { store } from "./app/store";

import { TaskProvider } from "./context/TaskContext.jsx";
import { StudySessionProvider } from "./context/StudySessionContext.jsx";

import "./styles/global.css";
import "./styles/dashboard.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <TaskProvider>
        <StudySessionProvider>
          <App />
        </StudySessionProvider>
      </TaskProvider>
    </Provider>
  </React.StrictMode>
);
