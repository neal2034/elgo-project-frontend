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
                const result = await  request.get({url:apiUrl.tags.index, params:{name}})
                if(result.isSuccess){
                    dispatch(tagActions.setTags(result.data))
                }
            }
        },
    addTag : (data:{name:string,color:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.post({url:apiUrl.tags.index, data})
                return result.isSuccess
            }
        },
    editTag : (data:{name:string, color:string, id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.put({url:apiUrl.tags.index, data})
                return result.isSuccess
            }
        },
    //删除标签
    delTag : (params:{id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.delete({url:apiUrl.tags.index, params})
                return result.isSuccess
            }
        },
    //撤销删除标签
    withdrawTag : (params:{id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.put({url:apiUrl.tags.withdrawDel, params})
                return result.isSuccess
            }
        }
}


export {tagActions,tagThunks}
export default tagSlice.reducer
