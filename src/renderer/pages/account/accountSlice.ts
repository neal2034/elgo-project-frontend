import {createSlice} from "@reduxjs/toolkit";

import request from "../../utils/request";
import apiUrl from '../../config/apiUrl'
import {ThunkAction} from "redux-thunk";
import {AnyAction} from 'redux'
import {RootState} from "../../store/store";
import umbrella from 'umbrella-storage';
import {setName} from '../organizationHome/orgSlice'


interface PayloadLogin {
    username:string,
    password:string,
}

const accountSlice = createSlice({
    name: 'account',
    initialState:{},
    reducers:{}
})


export const login =  (data:PayloadLogin): ThunkAction<void, RootState, unknown, AnyAction>=> {
     return  async  (dispatch , getState)=>{
         let result = await request.post({url: apiUrl.user.login, data, config:{baseURL:''}})
         if(result.isSuccess){
             umbrella.setLocalStorage('token', result.data.token)
             //获取组织列表
             let orgs = await request.get({url:apiUrl.organization.orgRes})
             umbrella.setLocalStorage('oserial', orgs.data[0].serial);
             console.log(orgs.data[0], "is organization")
             dispatch(setName( orgs.data[0].name))
             let proResult = await request.get({url:apiUrl.project.projectRes})
         }
         return result.isSuccess
    }
}





export default accountSlice.reducer
