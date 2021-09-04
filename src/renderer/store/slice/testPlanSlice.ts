import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";

interface ITestPlanDetail{
    id:number,
    serial:number,
    name:string,
    functionIds?:number[],
    creator:string,
    addAt:string,
    status:string
}


const testPlanSlice = createSlice({
    name:'testPlan',
    initialState:{
        page:0,
        total:0,
        testPlans:[],
        currentTestPlan: {} as ITestPlanDetail,

    },
    reducers:{
        setPage: (state, action) => { state.page = action.payload },
        setTotal: (state, action) => { state.total = action.payload },
        setTestPlans: (state, action) => { state.testPlans = action.payload },
        setCurrentTestPlan: (state, action) => { state.currentTestPlan = action.payload },
    }
})


const testPlanActions = testPlanSlice.actions
const testPlanThunks = {
    listTestPlan : (params:{page?:number,key?:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url:apiUrl.testPlan.index, params})
                if(result.isSuccess){
                    dispatch(testPlanActions.setTotal(result.data.total))
                    dispatch(testPlanActions.setTestPlans(result.data.data))
                    dispatch(testPlanActions.setPage(params.page?params.page:0))
                }

            }
        },
    addTestPlan : (data:{name:string,functionIds?:number[]})=>{
            return async (dispatch:Dispatch<any>)=>{
                 await request.post({url:apiUrl.testPlan.index, data})
            }
        },
    delTestPlan : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.delete({url:apiUrl.testPlan.index, params:{id}})
                return result.isSuccess
            }
        },
    withdrawDelTestPlan : (params:{id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result  =  await  request.put({url:apiUrl.testPlan.withdrawDel, params})
                return result.isSuccess
            }
        },
    getTestPlanDetail : (params:{id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url:apiUrl.testPlan.detail, params})
                if(result.isSuccess){
                    dispatch(testPlanActions.setCurrentTestPlan(result.data))
                }
            }
        },
    editName : (data:{name:string, id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.testPlan.editName, data})
            }
        },
    editFunztions : (data:{funztionIds?:number[], id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.testPlan.editFunztion, data})
            }
        }
}



export {testPlanActions, testPlanThunks, ITestPlanDetail}
export default testPlanSlice.reducer
