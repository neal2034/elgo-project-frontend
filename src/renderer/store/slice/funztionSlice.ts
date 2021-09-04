import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";
import api from "../../pages/api/api";
import {reqActions} from "@slice/reqSlice";



interface IListFunztionParams{
    id?:number,
    page?:number,
    name?:string,
    reqId?:number,
    tagIds?:number[]
}

interface IFunztion{
    id:number,
    name:string,
    [x:string]:any
}


const funztionSlice = createSlice({
    name:'funztion',
    initialState:{
        funztions:[] as IFunztion[],       //当前所有功能
        page:0,             //当前分页
        funzTotal:0,        //功能总数
        funztionStatus:[],  //功能状态
        currentFunztion: {} as IFunztion,

    },
    reducers:{
        setFunztions: (state, action) => { state.funztions = action.payload },
        setPage: (state, action) => { state.page = action.payload },
        setFunzTotal: (state, action) => { state.funzTotal = action.payload },
        setFunztionStatus: (state, action) => { state.funztionStatus = action.payload },
        setCurrentFunztion: (state, action) => { state.currentFunztion = action.payload },
    }
})




const funztionActions = funztionSlice.actions
const funztionThunks = {
    addFunztion : (funztion:any)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.post({url:apiUrl.funztion.index, data:funztion})
                if(result.isSuccess){
                    dispatch(funztionThunks.listFunztion({page:0}))
                }

            }
        },
    getFunztionDetail : (id:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url:apiUrl.funztion.detail, params:{id}})
                if(result.isSuccess){
                    dispatch(funztionActions.setCurrentFunztion(result.data))
                }
            }
        },
    listFunztion : (params:IListFunztionParams)=>{
            return async (dispatch:Dispatch<any>)=>{
                const {page = 0} = params
                   let result = await request.get({url: apiUrl.funztion.index, params})
                    if(result.isSuccess){
                        dispatch(funztionActions.setPage(page))
                        dispatch(funztionActions.setFunztions(result.data.data))
                        dispatch(funztionActions.setFunzTotal(result.data.total))
                    }
            }
        },
    listFunztionStatus : ()=>{
            return async (dispatch:Dispatch<any>)=>{
                let result = await request.get({url:apiUrl.funztionStatus.index})
                if(result.isSuccess){
                    dispatch(funztionActions.setFunztionStatus(result.data))
                }
            }
        },
    //修改功能标签
    editFunztionTags : (id:number, tagIds:number[])=>{
            return async (dispatch:Dispatch<any>)=>{
                let data = {id,tagIds}
                await request.put({url:apiUrl.funztion.tags, data})


            }
        },
    //修改功能所属需求
    editFunztionRequirement : (id:number, reqId?:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let data = {id,reqId}
                await request.put({url:apiUrl.funztion.editRequirement, data})
            }
        },
    //修改功能状态
    editFunztionStatus : (id:number,statusId:number)=>{
            return async (dispatch:Dispatch<any>)=>{
                let data = {id, statusId}
                await request.put({url:apiUrl.funztion.status, data})
            }
        },
    //修改功能描述
    editFunztionDes : (id:number, description?:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                let data = {id, description}
                await request.put({url:apiUrl.funztion.description, data})
            }
        },
    //删除功能
    delFunztion : (id:number)=>{
            return async (dispatch:Dispatch<any>, getState:any)=>{
                let page = getState().funztion.page
                let result = await request.delete({url:apiUrl.funztion.index, params:{id}})
                if(result.isSuccess){
                    dispatch(funztionThunks.listFunztion({page}))
                }
                return result.isSuccess
            }
        },
    //撤销删除
    withdrawDelFunztion : (id:number)=>{
            return async (dispatch:Dispatch<any>, getState:any)=>{
                let page = getState().funztion.page
                let result = await request.put({url:apiUrl.funztion.withdrawDel, params:{id}})
                if(result.isSuccess){
                    dispatch(funztionThunks.listFunztion({page}))
                }
                return result.isSuccess
            }
        }
}



export {funztionActions, funztionThunks, IFunztion}
export default funztionSlice.reducer
