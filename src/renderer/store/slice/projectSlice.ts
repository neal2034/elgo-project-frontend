import {createSlice} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";
import {Dispatch} from "react";


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
        availableOrgMembers:[],                 //可用于添加到组织的成员
        activeMenuKey:undefined,                //当前激活的项目菜单key
    },
    reducers:{
        setProjects:(state, action)=>{
            state.projects = action.payload
        },
        setProjectDetail: (state, action)=>{
            state.projectDetail = action.payload
        },
        setProjectMembers: (state, action) => { state.projectMembers = action.payload },
        setAvailableOrgMembers: (state, action) => { state.availableOrgMembers = action.payload },
        setActiveMenuKey: (state, action) => { state.activeMenuKey = action.payload },
    }
})


const projectThunks = {
    addProject: (name:string)=>{
        return async ()=>{
            const payload = {
                name,
                type:'PROJECT'
            }
            await request.post({url:apiUrl.project.projectRes, data:payload})
        }
    },
    listProject:()=>{
        return async (dispatch:Dispatch<any>)=>{
            const result = await request.get({url:apiUrl.project.projectRes})
            if(result.isSuccess){
                dispatch(projectActions.setProjects(result.data))
            }
        }
    },
    getProjectDetail: ()=>{
        return async (dispatch:Dispatch<any>)=>{
            console.log('will get project detail ')
            const result = await request.get({url:apiUrl.project.detail})
            if(result.isSuccess){
                dispatch(projectActions.setProjectDetail(result.data))
            }
        }
    },
    removeMember : (params:{projectMemberId:number})=>{
            return async ()=>{
                const result = await  request.delete({url:apiUrl.project.members, params})
                return result.isSuccess
            }
        },
    addMember : (data:{memberIds:number[]})=>{
            return async ()=>{
                 const result = await request.post({url:apiUrl.project.members, data})
                return result.isSuccess
            }
        },
    listAvailableMember : ()=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.get({url:apiUrl.orgMember.available})
                console.log('result is ', result)
                if(result.isSuccess){
                    dispatch(projectActions.setAvailableOrgMembers(result.data.members))
                }
            }
        }
}

const projectActions = projectSlice.actions
export {projectActions, projectThunks, IProjectDetail}
export default projectSlice.reducer
