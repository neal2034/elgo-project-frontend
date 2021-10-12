import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";



const elgoVersionSlice = createSlice({
    name: 'elgoVersion',
    initialState:{
        elgoVersions:[],
    },
    reducers:{
        setElgoVersions: (state, action) => { state.elgoVersions = action.payload },
    }
})



const elgoVersionAction = elgoVersionSlice.actions
const elgoVersionThunks = {
    listElgoVersions : ()=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.get({url: apiUrl.elgoVersion.index})
                if(result.isSuccess){
                    dispatch(elgoVersionAction.setElgoVersions(result.data))
                }
                return result.isSuccess

            }
        },
}

export {elgoVersionAction,elgoVersionThunks}

export default elgoVersionSlice.reducer;
