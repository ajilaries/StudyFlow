import { createSlice } from "@reduxjs/toolkit";

const initialState=[];

const taskSlice=createSlice({
    name:"tasks",

    initialState,

    reducers:{
        addTask:(state,action)=>{
            state.push(action.payload);
        }
    }
});


export const {addTask} = taskSlice.actions;

export default  taskSlice.reducer;