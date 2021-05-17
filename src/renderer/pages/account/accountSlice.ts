import {createSlice} from "@reduxjs/toolkit";

import request from "../../utils/request";
import apiUrl from '../../config/apiUrl'
import {ThunkAction} from "redux-thunk";
import {AnyAction} from 'redux'
import {RootState} from "../../store/store";
import umbrella from 'umbrella-storage';

 
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
             let orgs = await request.get({url:apiUrl.organization.orgRes})
             umbrella.setLocalStorage('oserial', orgs.data[0].serial);
         }
         return result.isSuccess
    }
}





export default accountSlice.reducer
