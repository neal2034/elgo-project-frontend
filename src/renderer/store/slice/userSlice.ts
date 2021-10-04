import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";



const userSlice = createSlice({
    name:'user',
    initialState:{},
    reducers:{}
})

const userActions = userSlice.actions
const userThunks = {
    editUserName : (data:{name:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.doPut(apiUrl.user.name, data)
                return result.isSuccess
            }
        }
}

export {userActions, userThunks}

export default userSlice.reducer
