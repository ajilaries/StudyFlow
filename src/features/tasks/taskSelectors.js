import {createSelector} from "@reduxjs/toolkit";

export const selectAllTasks=(state)=>state.tasks;

export const selectTotalTasks=(state)=>state.tasks.length;


// memorized selectors
export const selectCompletedTasks=createSelector(
  [selectAllTasks],
  (tasks)=>tasks.filter((task)=>task.completed)
);

export const selectPendingTasks=createSelector(
  [selectAllTasks],
  (tasks)=>tasks.filter((task)=>!task.completed)
);


export const selectCompletedCount=createSelector(
  [selectCompletedTasks],
  (completedTasks)=>completedTasks.length
);