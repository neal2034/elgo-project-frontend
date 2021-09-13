import {createSlice} from "@reduxjs/toolkit";

import request from "../../utils/request";
import apiUrl from '@config/apiUrl'
import {ThunkAction} from "redux-thunk";
import {AnyAction} from 'redux'
import {RootState} from "../store";
import umbrella from 'umbrella-storage';
import {setName} from './orgSlice'
import globalConfig from '@config/global.config'
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
        currentMember: {},
    },
    reducers:{
        setMemberName:(state, action)=>{
            state.memberName = action.payload
        },
        setMemberEmail:(state, action)=>{
            state.memberEmail = action.payload
        },
        setCurrentMember:(state, action)=>{
            state.currentMember = action.payload
        }
    }
})


export const login =  (data:PayloadLogin): ThunkAction<void, RootState, unknown, AnyAction>=> {
     return  async  (dispatch)=>{
         const baseURL = globalConfig.baseUrl.replace(globalConfig.apiPrefix, '')
         const result = await request.post({url: apiUrl.user.login, data, config:{baseURL}})
         if(result.isSuccess){
             umbrella.setLocalStorage('token', result.data.token)
             //获取组织列表
             const loginOrg = await request.get({url:apiUrl.organization.getLogin})
             if(loginOrg.isSuccess){
                 umbrella.setLocalStorage('oserial', loginOrg.data.serial);
                 dispatch(setName( loginOrg.data.name))
             }
         }
         return result.isSuccess
    }
}


export const accountThunks = {
    getCurrentMember: ()=>{
        return async (dispatch:Dispatch<any>)=>{
            const result = await request.get({url: apiUrl.orgMember.currentMember})
            if(result.isSuccess){
                dispatch(accountSlice.actions.setMemberName(result.data.name))
                dispatch(accountSlice.actions.setMemberEmail(result.data.email))
                dispatch(accountSlice.actions.setCurrentMember(result.data))
            }
        }
    }
}




export default accountSlice.reducer
