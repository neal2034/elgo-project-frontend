import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";



const taskSlice = createSlice({
    name: 'task',
    initialState:{
        groups:[],
    },
    reducers:{
            setGroups: (state, action) => { state.groups = action.payload },
    }
})


const taskActions = taskSlice.actions

const taskThunks = {
    listTaskGroup : ()=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url:apiUrl.taskList.index})
                if(result.isSuccess){
                    dispatch(taskSlice.actions.setGroups(result.data))
                }
            }
        },
    addTaskGroup : (name?:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                   await request.post({url:apiUrl.taskList.index, data:{name}})
            }
        },
    editTaskGroup : (id:number, name?:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.taskList.index, data:{id, name}})
            }
        }
}


export {taskActions, taskThunks}

export default taskSlice.reducer
