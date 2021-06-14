import {createSlice} from "@reduxjs/toolkit";

import request from "../../utils/request";
import apiUrl from '../../config/apiUrl'
import {ThunkAction} from "redux-thunk";
import {AnyAction} from 'redux'
import {RootState} from "../../store/store";
import umbrella from 'umbrella-storage';
import {setName} from '../organizationHome/orgSlice'
import globalConfig from '../../config/global.config'
import {Dispatch} from "react";


interface PayloadLogin {
    username:string,
    password:string,
}



const accountSlice = createSlice({
    name: 'account',
    initialState:{
        memberName:null,
        memberEmail:null,
    },
    reducers:{
        setMemberName:(state, action)=>{
            state.memberName = action.payload
        },
        setMemberEmail:(state, action)=>{
            state.memberEmail = action.payload
        }
    }
})


export const login =  (data:PayloadLogin): ThunkAction<void, RootState, unknown, AnyAction>=> {
     return  async  (dispatch , getState)=>{
         let baseURL = globalConfig.baseUrl.replace(globalConfig.apiPrefix, '')
         let result = await request.post({url: apiUrl.user.login, data, config:{baseURL}})
         if(result.isSuccess){
             umbrella.setLocalStorage('token', result.data.token)
             //获取组织列表
             let orgs = await request.get({url:apiUrl.organization.orgRes})
             umbrella.setLocalStorage('oserial', orgs.data[0].serial);
             dispatch(setName( orgs.data[0].name))
             let proResult = await request.get({url:apiUrl.project.projectRes})
         }
         return result.isSuccess
    }
}


export const accountThunks = {
    getCurrentMember: ()=>{
        return async (dispatch:Dispatch<any>)=>{
            let result = await request.get({url: apiUrl.orgMember.currentMember})
            if(result.isSuccess){
                dispatch(accountSlice.actions.setMemberName(result.data.name))
                dispatch(accountSlice.actions.setMemberEmail(result.data.email))
            }
        }
    }
}




export default accountSlice.reducer
