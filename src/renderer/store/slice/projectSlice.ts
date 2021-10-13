import {createSlice} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";
import {Dispatch} from "react";



//项目成员信息
interface IProjectMember{
    id:number,
    orgMemberId:number,
    userId:number,
    name:string,
    email:string,
    boolEnable:boolean,
    boolProjectOwner:boolean,
}

//项目信息
interface IProject{
    serial:number,
    name:string,
    color?:string,
    icon?:string
    members:IProjectMember [],
}

const projectSlice = createSlice({
    name:'project',
    initialState:{
        projects:[],
        projectDetail:{} as IProject,   //当前的项目详情
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
    addProject: (data:{name:string, color:string, icon:string})=>{
        return async ()=>{
            await request.post({url:apiUrl.project.projectRes, data})
        }
    },
    delProject : (params:{serial:number})=>{
            return async ()=>{
                const result = await  request.doDel(apiUrl.project.projectRes, params)
                return result.isSuccess
            }
        },
    editProject : (data:{name:string, icon:string, color:string, serial:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await  request.doPut(apiUrl.project.projectRes, data)
                return result.isSuccess
            }
        },
    withdrawDelProject : (params:{serial:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.doPut(apiUrl.project.withdraw,undefined, params)
                return result.isSuccess
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
                if(result.isSuccess){
                    dispatch(projectActions.setAvailableOrgMembers(result.data.members))
                }
            }
        }
}

const projectActions = projectSlice.actions
export {projectActions, projectThunks, IProject}
export default projectSlice.reducer
