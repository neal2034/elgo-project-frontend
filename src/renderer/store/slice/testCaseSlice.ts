import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";
import api from "../../pages/api/api";


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
        funztionCases: [],      //具体功能对应的测试用例
        page:0,
        total:0,
        currentTestCase: {} as ITestCaseDetail,
    },
    reducers:{
        setTestCases: (state, action) => { state.testCases = action.payload },
        setPage: (state, action) => { state.page = action.payload },
        setTotal: (state, action) => { state.total = action.payload },
        setCurrentTestCase: (state, action) => { state.currentTestCase = action.payload },
        setFunztionCases: (state, action) => { state.funztionCases = action.payload },
    }
})



const testCaseActions = testCaseSlice.actions
const testCaseThunks = {
    listTestCase : (params:{page:number, searchKey?:string, funztionId?:number, tagIds?:number[], priorities?:string[] })=>{
            return async (dispatch:Dispatch<any>)=>{

                const result = await request.get({url:apiUrl.testCase.index, params})
                if(result.isSuccess){
                    dispatch(testCaseActions.setPage(params.page))
                    dispatch(testCaseActions.setTotal(result.data.total))
                    dispatch(testCaseActions.setTestCases(result.data.data))
                }
            }
        },
    listFunztionCases : (params:{page:number, funztionId:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await request.get({url: apiUrl.testCase.index, params})
                if(result.isSuccess){
                    dispatch(testCaseActions.setFunztionCases(result.data.data))
                }
            }
        },
    addTestCase : (data:{name:string, description?:string,priority:string, funztionId?:number, tagIds?:number[]})=>{
            return async ()=>{
                const payload:any = Object.assign({}, data)
                await  request.post({url:apiUrl.testCase.index, data:payload})
            }
        },
    getTestCaseDetail : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                const result = await  request.get({url:apiUrl.testCase.detail, params:{id}})
                if(result.isSuccess){
                    dispatch(testCaseActions.setCurrentTestCase(result.data))
                }
            }
        },
    editTestCaseName : (data:{id:number,name:string})=>{
            return async ()=>{
                    await  request.put({url:apiUrl.testCase.editName, data})

            }
        },
    editTestCaseDes : (data:{id:number, description?:string})=>{
            return async ()=>{
                await request.put({url:apiUrl.testCase.editDescription, data})
            }
        },
    editFunztion : (data:{id:number, funztionId?:number})=>{
            return async ()=>{
                await request.put({url:apiUrl.testCase.editFunztion, data})
            }
        },
    editPriority : (data:{id:number, priority?:string})=>{
            return async ()=>{
                await  request.put({url:apiUrl.testCase.editPriority, data})
            }
        },
    editTags: (data:{id:number, tagIds?:number[]})=>{
        return async ()=>{
            await  request.put({url:apiUrl.testCase.editTag, data})
        }
    },
    deleteTestCase : (id:number)=>{
            return async ()=>{
                const result = await  request.delete({url:apiUrl.testCase.index, params:{id}})
                return result.isSuccess
            }
        },
    withdrawDelTestCase : (id:number)=>{
            return async ()=>{
                const result = await request.put({url:apiUrl.testCase.withdrawDel, params:{id}})
                return result.isSuccess
            }
        }

}



export {testCaseActions,testCaseThunks,ITestCaseDetail}
export default testCaseSlice.reducer
