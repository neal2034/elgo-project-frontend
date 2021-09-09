import {createSlice} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";
import {Dispatch} from "react";
import {apiActions} from "@slice/apiSlice";


interface IProjectDetail{
    members:any [],
    [x:string]:any
}


const projectSlice = createSlice({
    name:'project',
    initialState:{
        projects:[],
        projectDetail:{} as IProjectDetail,   //当前的项目详情
        projectMembers:[],                     //用于在组织环境下选择某个项目的成员
    },
    reducers:{
        setProjects:(state, action)=>{
            state.projects = action.payload
        },
        setProjectDetail: (state, action)=>{
            state.projectDetail = action.payload
        },
        setProjectMembers: (state, action) => { state.projectMembers = action.payload },
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
            console.log('will get project detail ')
            let result = await request.get({url:apiUrl.project.detail})
            if(result.isSuccess){
                dispatch(projectActions.setProjectDetail(result.data))
            }
        }
    }
}

const projectActions = projectSlice.actions
export {projectActions, projectThunks, IProjectDetail}
export default projectSlice.reducer
