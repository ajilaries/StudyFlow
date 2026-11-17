import { createSlice } from "@reduxjs/toolkit";

const initialState=[];

const taskSlice=createSlice({
    name:"tasks",

    initialState,

    reducers:{
        // Create
        addTask:(state,action)=>{
            state.push(action.payload);
        },

        // update
        updateTask:(state,action)=>{
            const {id, updatedData}=action.payload;

            const task=state.find((task)=>task.id===id);

            if(task){
                Object.assign(task,updatedData);

            }
        },
        // Toggle completion
        toggleTask:(state,action)=>{
            const task=state.find(
                (task)=>task.id===action.payload
            );
            if(task){
                task.completed=!task.completed;
            }
        },
        // delete
        deleteTask:(state,action)=>{
            return state.filter(
                (task)=>task.id!==action.payload
            );
        }
    }
});
export const{
    addTask,
    updateTask,
    toggleTask,
    deleteTask
}=taskSlice.actions;


export default taskSlice.reducer;
