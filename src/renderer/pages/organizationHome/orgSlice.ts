import {createSlice} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from '../../config/apiUrl'
import {Dispatch} from "react";
import umbrella from "umbrella-storage";


const orgSlice = createSlice({
    name: 'organization',
    initialState:{
        name:'',
        projects:[],
        departments:[],
        organization: null,          //当前组织
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
        let result = await request.get({url:apiUrl.organization.detail})
        if(result.isSuccess){
            dispatch(orgSlice.actions.setOrganization(result.data))
        }
    }
}

export const listProjects = ()=>{
    return async(dispatch:Dispatch<any>)=>{
        let result = await request.get({url:apiUrl.project.projectRes})
        if(result.isSuccess){
            let projects = result.data.filter((item:any) => item.type==='PROJECT');
            let departments = result.data.filter((item:any) => item.type==='DEPARTMENT');
            dispatch(orgSlice.actions.setProjects(projects))
            dispatch(orgSlice.actions.setDepartments(departments))
        }
    }
}

export const orgThunks = {
    getOrganizationDetail: ()=> {
        return async (dispatch: Dispatch<any>) => {
            let result = await request.get({url: apiUrl.organization.detail})
            if (result.isSuccess) {
                dispatch(orgSlice.actions.setOrganization(result.data))
                dispatch(orgSlice.actions.setName(result.data.name))
            }
        }
    },
    listOrganizations: ()=>{
        return async (dispatch: Dispatch<any>) => {
            let orgs = await request.get({url:apiUrl.organization.orgRes})
            if(orgs.isSuccess){
                dispatch(orgSlice.actions.setOrganizationList(orgs.data))
            }

        }
    },
    setLastLoginOrg: ()=>{
        return ()=>{
            request.put({url:apiUrl.organization.lastLogin})
        }
    }
}


export const {setName} = orgSlice.actions

export default orgSlice.reducer
