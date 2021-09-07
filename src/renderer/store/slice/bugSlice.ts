import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";


interface IAddBugDto{
    name:string,
    testerId?:number,
    handlerId?:number,
    description?:string,
    severity?: 'CRASH'|'SERIOUS'|'NORMAL'|'HINT'|'ADVICE',
    tagIds?:number[],
    testCaseId?:number
}
interface IBugDetail{
    id:number,
    name:string,
    serial:number,
    creator:string,
    description?:string,
    handlerId?:number,
    testerId?:number,
    severity:string
    tagIds?:number[],
    status:string
}

export type TBugSeverity = 'CRASH' | 'SERIOUS' | 'NORMAL' | 'HINT' | 'ADVICE';
export type TBugStatus = 'OPEN' | 'REJECT' | 'FIXED' | 'VERIFIED' | 'WORK_AS_DESIGN' | 'CAN_NOT_REPRODUCE';

export interface IBugSearchParams{
    searchKey?:string,
    testerIds?:string,
    handlerIds?:string,
    severities?: TBugSeverity[],
    tagIds?: number[],
    statusList?: TBugStatus[],

}


export interface IBugListParams extends IBugSearchParams{
    page?:number
}

const bugSlice = createSlice({
    name:'bug',
    initialState:{
        bugs:[],
        page:0,
        total:0,
        currentBug:{} as IBugDetail
    },
    reducers:{
        setBugs: (state, action) => { state.bugs = action.payload },
        setPage: (state, action) => { state.page = action.payload },
        setTotal: (state, action) => { state.total = action.payload },
        setCurrentBug: (state, action) => { state.currentBug = action.payload },

    }
})




const  bugActions = bugSlice.actions
const bugThunks = {
    listBugs : (params?:IBugListParams)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url: apiUrl.bug.index, params})
                console.log('here is the data ', result, params)
                if(result.isSuccess){
                    dispatch(bugActions.setBugs(result.data.data))
                    dispatch(bugActions.setTotal(result.data.total))
                    const page = params && params.page? params.page : 0
                    dispatch(bugActions.setPage(page))
                }
            }
        },
    addBug : (data:IAddBugDto)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.post({url:apiUrl.bug.index, data})
                return result.isSuccess
            }
        },
    getBugDetail : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url: apiUrl.bug.detail, params:{id}})
                if(result.isSuccess){
                    dispatch(bugActions.setCurrentBug(result.data))
                }
            }
        },
    editName : (data:{id:number, name:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.bug.editName, data})
            }
        },
    editQa : (data:{id:number, testerId?:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.bug.editTester, data})
            }
        },
    editHandler : (data:{id:number, handlerId?:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                await  request.put({url:apiUrl.bug.editHandler, data})
            }
        },
    editStatus : (data:{id:number, status:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                await  request.put({url:apiUrl.bug.editStatus, data})
            }
        },
    editSeverity : (data:{id:number, severity:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.bug.editSeverity, data})
            }
        },
    editTags : (data:{id:number, tagIds?:number[]})=>{
            return async (dispatch:Dispatch<any>)=>{
                await  request.put({url:apiUrl.bug.editTags, data})
            }
        },
    editDescription : (data:{id:number, description?:string})=>{
            return async (dispatch:Dispatch<any>)=>{
                await request.put({url:apiUrl.bug.editDescription, data})
            }
        },
    deleteBug : (params:{id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.delete({url:apiUrl.bug.index, params})
                return result.isSuccess
            }
        },
    withdrawDelBug : (params:{id:number})=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await  request.put({url: apiUrl.bug.withdrawDel, params})
                return result.isSuccess
            }
        }
}



export {bugActions, bugThunks, IAddBugDto}

export default bugSlice.reducer
