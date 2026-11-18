
export const selectAllTasks = (state) => state.tasks;

export const selectCompletedTasks = (state) =>
  state.tasks.filter((task) => task.completed);

export const selectPendingTasks = (state) =>
  state.tasks.filter((task) => !task.completed);

export const selectTotalTasks = (state) =>
  state.tasks.length;

export const selectCompletedCount = (state) =>
  state.tasks.filter((task) => task.completed).length;
