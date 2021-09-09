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

interface ITaskDetailInfo{
    name:string,
    id:number,
    serial:number,
    taskListId:number,
    creatorDto:{
        name:string
    },
    priority:string,
    status:string,
    deadline?:string,
    tagIds?:number[],
    description?:string,
    handlerDto?:{
        id:number
    }
}

interface ITaskGroup{
    id:number,
    name:string,
    [x:string]:any,
}



const taskSlice = createSlice({
    name: 'task',
    initialState:{
        groups:[] as ITaskGroup[],
        tasks:{},
        myTasks:[],
        totalTasks:0,
        currentTask: {} as ITaskDetailInfo,
    },
    reducers:{
            setGroups: (state, action) => { state.groups = action.payload },
            setTasks: (state, action) => {
                let groupId = action.payload.taskGroupId
                // @ts-ignore
                state.tasks[groupId] = action.payload.tasks
                let total = 0
                for(let key in state.tasks){
                    // @ts-ignore
                    let num = state.tasks[key].length
                    total = total + num
                }
                state.totalTasks = total

            },
            setCurrentTask: (state, action) => { state.currentTask = action.payload },
            setMyTasks: (state, action) => { state.myTasks = action.payload },
    }
})


const taskActions = taskSlice.actions

const taskThunks = {
    listMyTasks : ()=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url: apiUrl.task.mine})
                if(result.isSuccess){
                    dispatch(taskActions.setMyTasks(result.data))
                }
            }
        },

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
    listTask : (taskGroupId:number, name?:string, handlerId?:number, priority?:string, tagIds?:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url:apiUrl.task.index, params:{size:2000, taskListId:taskGroupId,
                        key:name,handlerIds:handlerId, priorities:priority, tagIds}})
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
        },
    markTaskUnDone : (params:{id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.task.setUndone, params})
            }
        },
    getTaskDetail : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url:apiUrl.task.detail, params:{id}})
                if(result.isSuccess){
                    dispatch(taskActions.setCurrentTask(result.data))
                }
            }
        },
    editTaskName : (id:number, name:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.put({url:apiUrl.task.editName, data:{id,name}})
                if(result.isSuccess){
                    dispatch(taskThunks.getTaskDetail(id))
                }
            }
        },
    editTaskHandler : (id:number, handlerId?:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                 await request.put({url:apiUrl.task.editHandler, data:{id,handlerId}})

            }
        },
    editTaskPriority : (id:number, priority:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.task.editPriority, data:{id, priority}})
            }
        },
    editTaskDeadline : (id:number, deadline?:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                await  request.put({url:apiUrl.task.editDeadline, data:{id, deadline}})
            }
        },
    //修改任务标签
    editTaskTags : (id:number, tagIds:number[])=>{
        return async (dispatch:Dispatch<any>)=>{
            let data = {id,tagIds}
            await request.put({url:apiUrl.task.editTags, data})


        }
    },
    editTaskDes : (id:number, description?:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.task.editDescription, data:{id,description}})
            }
        },
    editTaskStatus : (id:number, status:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.task.editStatus, data:{id, status}})
            }
        },
    deleteTask : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.delete({url:apiUrl.task.index, params:{id}})

                return result.isSuccess
            }
        },
    withdrawDelTask : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.post({url:apiUrl.task.withdraw, params:{id}})
                return result.isSuccess
            }
        }

}


export {taskActions, taskThunks,ITaskDetailInfo,ITaskGroup}

export default taskSlice.reducer
