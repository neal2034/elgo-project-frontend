import {createSlice} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from '@config/apiUrl'
import {Dispatch} from "react";


const orgSlice = createSlice({
    name: 'organization',
    initialState:{
        name:'',
        projects:[],
        departments:[],
        organization: {} as any,          //当前组织
        orgList:[],
    },
    reducers:{
        setName:  (state, action) => {
            state.name = action.payload
        },
        setProjects: (state,action)=>{
            state.projects = action.payload
        },
        setDepartments: (state, action)=>{
            state.departments = action.payload
        },
        setOrganization:(state, action)=>{
            state.organization = action.payload
            state.name = action.payload.name
        },
        setOrganizationList: (state,action)=>{
            state.orgList = action.payload
        }
    }
})

//获取组织详情
export const getOrganizationDetail = ()=>{
    return async (dispatch:Dispatch<any>)=>{
        const result = await request.get({url:apiUrl.organization.detail})
        if(result.isSuccess){
            dispatch(orgSlice.actions.setOrganization(result.data))
        }
    }
}

export const listProjects = ()=>{
    return async(dispatch:Dispatch<any>)=>{
        const result = await request.get({url:apiUrl.project.projectRes})
        if(result.isSuccess){
            const projects = result.data.filter((item:any) => item.type==='PROJECT');
            const departments = result.data.filter((item:any) => item.type==='DEPARTMENT');
            dispatch(orgSlice.actions.setProjects(projects))
            dispatch(orgSlice.actions.setDepartments(departments))
        }
    }
}

export const orgThunks = {
    getOrganizationDetail: ()=> {
        return async (dispatch: Dispatch<any>) => {
            const result = await request.get({url: apiUrl.organization.detail})
            if (result.isSuccess) {
                dispatch(orgSlice.actions.setOrganization(result.data))
                dispatch(orgSlice.actions.setName(result.data.name))
            }
        }
    },
    listOrganizations: ()=>{
        return async (dispatch: Dispatch<any>) => {
            const orgs = await request.get({url:apiUrl.organization.orgRes})
            if(orgs.isSuccess){
                dispatch(orgSlice.actions.setOrganizationList(orgs.data))
            }

        }
    },
    setLastLoginOrg: ()=>{
        return ()=>{
            request.put({url:apiUrl.organization.lastLogin})
        }
    },
    inviteMember : (data:{orgMembers:{email:string}[]})=>{
            return async ()=>{
                const result = await request.post({url: apiUrl.organization.addMember, data})
                return result.isSuccess
            }
        },
    addOrganization : (data:{name:string, password:string, token:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.post({url: apiUrl.organization.addOrg, data})
                return result.isSuccess
            }
        },
    addAnotherOrganization : (data:{name:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.post({url: apiUrl.organization.orgRes, data})
                return result.isSuccess
            }
        },
}


export const {setName} = orgSlice.actions

const orgActions = orgSlice.actions

export {orgActions}

export default orgSlice.reducer
