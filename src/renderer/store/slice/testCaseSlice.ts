import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";


interface ITestCaseDetail{
    id:number,
    serial:number,
    name:string,
    description?:string,
    priority:string,
    funztionId?:number,
    tagIds?:number[],
    creator:{
        name:string,
        id:number
    }
}

const testCaseSlice = createSlice({
    name:'testCase',
    initialState:{
        testCases:[],
        page:0,
        total:0,
        currentTestCase: {} as ITestCaseDetail,
        isToastOpen:false,
    },
    reducers:{
        setTestCases: (state, action) => { state.testCases = action.payload },
        setPage: (state, action) => { state.page = action.payload },
        setTotal: (state, action) => { state.total = action.payload },
        setCurrentTestCase: (state, action) => { state.currentTestCase = action.payload },
        setIsToastOpen: (state, action) => { state.isToastOpen = action.payload },
    }
})



const testCaseActions = testCaseSlice.actions
const testCaseThunks = {
    listTestCase : (params:{page:number, searchKey?:string, funztionId?:number, tagIds?:number[], priorities?:string[] })=>{
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
        },
    getTestCaseDetail : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.get({url:apiUrl.testCase.detail, params:{id}})
                if(result.isSuccess){
                    dispatch(testCaseActions.setCurrentTestCase(result.data))
                }
            }
        },
    editTestCaseName : (data:{id:number,name:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                    await  request.put({url:apiUrl.testCase.editName, data})

            }
        },
    editTestCaseDes : (data:{id:number, description?:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.testCase.editDescription, data})
            }
        },
    editFunztion : (data:{id:number, funztionId?:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.testCase.editFunztion, data})
            }
        },
    editPriority : (data:{id:number, priority?:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                await  request.put({url:apiUrl.testCase.editPriority, data})
            }
        },
    editTags: (data:{id:number, tagIds?:number[]})=>{
        return async (dispatch:Dispatch<any>)=>{
            await  request.put({url:apiUrl.testCase.editTag, data})
        }
    },
    deleteTestCase : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.delete({url:apiUrl.testCase.index, params:{id}})
                if(result.isSuccess){
                    dispatch(testCaseActions.setIsToastOpen(true))
                }
            }
        },
    withdrawDelTestCase : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.put({url:apiUrl.testCase.withdrawDel, params:{id}})
                if(result.isSuccess){
                    dispatch(testCaseActions.setIsToastOpen(true))
                }
            }
        }

}



export {testCaseActions,testCaseThunks,ITestCaseDetail}
export default testCaseSlice.reducer
