import {createSlice} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";
import {Dispatch} from "react";


const tagSlice = createSlice({
    name:'tag',
    initialState:{
        tags:[]
    },
    reducers:{
        setTags: (state, action) => { state.tags = action.payload },
    }
})




const tagActions = tagSlice.actions
const tagThunks = {
    listTags : (name?:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.get({url:apiUrl.tags.index, params:{name}})
                if(result.isSuccess){
                    dispatch(tagActions.setTags(result.data))
                }
            }
        }
}


export {tagActions,tagThunks}
export default tagSlice.reducer
