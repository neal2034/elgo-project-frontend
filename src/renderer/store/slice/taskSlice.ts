import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";


/**
 * 添加任务参数DTO
 */
interface IAddTaskDto{
    taskListId:number,
    name:string,
    deadline?:Date,
    handlerId?:number,
    tagIds?:number[],
    priority?:string,
    description?:string,
    funztionId?:number,
}


const taskSlice = createSlice({
    name: 'task',
    initialState:{
        groups:[],
        tasks:{}
    },
    reducers:{
            setGroups: (state, action) => { state.groups = action.payload },
            setTasks: (state, action) => {
                let groupId = action.payload.taskGroupId
                // @ts-ignore
                state.tasks[groupId] = action.payload.tasks

            },
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
        },
    addTask : (task:IAddTaskDto)=>{
            return async (dispatch:Dispatch<any>)=>{
                await  request.post({url:apiUrl.task.index, data:task})
            }
        },
    listTask : (taskGroupId:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url:apiUrl.task.index, params:{size:2000, taskListId:taskGroupId}})
                if(result.isSuccess){
                    let payload = {
                        taskGroupId:taskGroupId,
                        tasks:result.data.data
                    }
                    dispatch(taskActions.setTasks(payload))
                }

            }
        },
    markTaskDone : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                  await request.put({url:apiUrl.task.setDone, params:{id}})

            }
        }
}


export {taskActions, taskThunks}

export default taskSlice.reducer
