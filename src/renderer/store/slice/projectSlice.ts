import {createSlice} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";
import {Dispatch} from "react";
import {apiActions} from "@slice/apiSlice";


const projectSlice = createSlice({
    name:'project',
    initialState:{
        projects:[],
        projectDetail:{},   //当前的项目详情
    },
    reducers:{
        setProjects:(state, action)=>{
            state.projects = action.payload
        },
        setProjectDetail: (state, action)=>{
            state.projectDetail = action.payload
        }
    }
})


const projectThunks = {
    addProject: (name:string)=>{
        return async ()=>{
            let payload = {
                name,
                type:'PROJECT'
            }
            await request.post({url:apiUrl.project.projectRes, data:payload})
        }
    },
    listProject:()=>{
        return async (dispatch:Dispatch<any>)=>{
            let result = await request.get({url:apiUrl.project.projectRes})
            if(result.isSuccess){
                dispatch(projectActions.setProjects(result.data))
            }
        }
    },
    getProjectDetail: ()=>{
        return async (dispatch:Dispatch<any>)=>{
            let result = await request.get({url:apiUrl.project.detail})
            if(result.isSuccess){
                dispatch(projectActions.setProjectDetail(result.data))
            }
        }
    }
}

const projectActions = projectSlice.actions
export {projectActions, projectThunks}
export default projectSlice.reducer
