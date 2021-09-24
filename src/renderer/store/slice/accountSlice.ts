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
        signupUserExist: false,  // 注册的用户是否已存在
        signupEmailSent: false, // 注册邮件是否已发送
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
        },
        setSignupUserExist: (state, action) => { state.signupUserExist = action.payload },
        setSignupEmailSent: (state, action) => { state.signupEmailSent = action.payload },
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

const accountThunks = {
    getCurrentMember: () => {
        return async (dispatch: Dispatch<any>) => {
            const result = await request.get({url: apiUrl.orgMember.currentMember})
            if (result.isSuccess) {
                dispatch(accountSlice.actions.setMemberName(result.data.name))
                dispatch(accountSlice.actions.setMemberEmail(result.data.email))
                dispatch(accountSlice.actions.setCurrentMember(result.data))
            }
        }
    },
    signup : (data:{email:string, code:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.post({url: apiUrl.user.signup, data})
                if(result.isSuccess){
                    dispatch(accountActions.setSignupUserExist(result.data.userExist))
                    dispatch(accountActions.setSignupEmailSent(result.data.emailSent))
                }
                return result.isSuccess
            }
        },
    resentSignUp : (data:{email:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.post({url:apiUrl.user.resent, data})
                return result.isSuccess
            }
        },
}

const accountActions = accountSlice.actions


export {accountActions, accountThunks}



export default accountSlice.reducer
