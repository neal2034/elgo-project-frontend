import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";



const testCaseSlice = createSlice({
    name:'testCase',
    initialState:{
        testCases:[],
        page:0,
        total:0,
    },
    reducers:{
        setTestCases: (state, action) => { state.testCases = action.payload },
        setPage: (state, action) => { state.page = action.payload },
        setTotal: (state, action) => { state.total = action.payload },
    }
})



const testCaseActions = testCaseSlice.actions
const testCaseThunks = {
    listTestCase : (params:{page:number})=>{
            return async (dispatch:Dispatch<any>)=>{

                let result = await request.get({url:apiUrl.testCase.index, params})
                if(result.isSuccess){
                    dispatch(testCaseActions.setPage(params.page))
                    dispatch(testCaseActions.setTotal(result.data.total))
                    dispatch(testCaseActions.setTestCases(result.data.data))
                }
            }
        },
    addTestCase : (data:{name:string, description?:string,priority:string, funztionId?:number, tagIds?:number[]})=>{
            return async (dispatch:Dispatch<any>)=>{
                let payload:any = Object.assign({}, data)
                await  request.post({url:apiUrl.testCase.index, data:payload})
            }
        }
}



export {testCaseActions,testCaseThunks}
export default testCaseSlice.reducer
