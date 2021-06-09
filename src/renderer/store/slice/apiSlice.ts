import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from '../../config/apiUrl'
import {Dispatch} from "react";
import api from "../../pages/api/api";

type ApiMethod = "GET"|"POST"|"DELETE"|"PUT"
type BodyType = "NONE" | "JSON"
type AuthType = "NONE" | "INHERIT" | "BEARER"

export interface ApiEnvItem{
    name:string,
    value:string,
    used:boolean
}

export interface ApiEnv{
    id:number,
    name:string,
    envItems?:ApiEnvItem[]
}


export interface ApiParams{
    paramKey?:string,
    paramValue?:string,
    description?:string,
    selected?:boolean,
    key:number,
}

export interface ApiPathVar{
    varKey?:string,
    varValue?:string,
    description?:string,
    key:number,
}

export interface ApiHeaderItem{
    headerKey?:string,
    headerValue?:string,
    description?:string,
    selected?:boolean,
    key:number,
}

export interface API{
    id?:number,
    name:string,
    serial:number,
    isExample?:boolean,     //是否为用例
    method:ApiMethod,          //GET/POST/DELETE/PUT
    params:ApiParams[],
    pathVars?:ApiPathVar[],
    headers:ApiHeaderItem[],
    dirty:boolean,
    url?:string,
    authType?:AuthType,
    authToken?:string,
    bodyType?:BodyType,
    bodyJson?:string,
    testsCode?:string,
    responseBody?:string,
}


interface IPayloadAddApiSet {
    name:string,
    description?:string,
    authToken?:string,
    authType:'NONE'|'INHERIT'|'BEARER',
}

interface IPayloadEditApiSet extends IPayloadAddApiSet{
    id:number
}


interface IPayloadAddApiGroup {
    name:string,
    description?:string,
    authToken?:string,
    authType:'NONE'|'INHERIT'|'BEARER',
    parentId:number,
}

interface IPayloadEditApiGroup{
    name:string,
    description?:string,
    authToken?:string,
    authType:'NONE'|'INHERIT'|'BEARER',
    id:number
}

interface IPayloadAddApiTreeItem {
    name:string,
    description?:string,
    parentId:number
}

interface IPayloadEditApiTreeItem {
    name:string,
    id:number,
    description?:string
}

interface IPayloadDelApiItem{
    id:number
}

interface IPayloadDelApiTreeItem{
    treeItemId:number
}

let theActiveApis: Array<API> = []


const apiSlice = createSlice({
    name: 'api',
    initialState:{
        activeApis:theActiveApis,
        currentApiSerial:-1,
        apiTreeItems:[],
        toastOpen:false,
        envs:[],        //环境变量
        currentEnvId:-1,    //当前环境变量id

    },
    reducers:{
        setToastOpen:(state, action)=>{
            state.toastOpen = action.payload
        },
        addActiveApi:(state)=>{
            let serial = getUsableSerial(state.activeApis)
            let newApi = {name:'未命名接口', serial:serial, method:'GET' as ApiMethod,  isExample:false, dirty:false,
                headers: [{key:10}],
                params:[{key:0}]}
            state.activeApis.push(newApi)
            state.currentApiSerial=serial
        },
        //设置当前激活的API
        setCurrentApiSerial:(state, action)=>{
            state.currentApiSerial = action.payload
        },
        updateCurrentApi:(state, action) => {
            state.activeApis.forEach(item=>{
                if(item.serial === state.currentApiSerial){
                    Object.assign(item, action.payload, {dirty:true})
                }
            })
        },
        setApiTreeItems:(state, action)=>{
            state.apiTreeItems = action.payload
        }
    }
})


//获取可用的api 序列号
const getUsableSerial = (activeApis:API[])=>{
    let serial = new Date().getTime();
    let isSerialExist =activeApis.filter(api=> api.serial === serial).length !== 0;
    while(isSerialExist){
        serial = new Date().getTime();
        isSerialExist = activeApis.filter(api=> api.serial === serial).length !== 0;
    }
    return serial;
}



const addApiSet = (data:IPayloadAddApiSet)=>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.post({url: apiUrl.api.setRes, data})
        if(result.isSuccess){
            dispatch(listApiTreeItems())
        }
    }
}

const editApiSet = (data:IPayloadEditApiSet)=>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.put({url:apiUrl.api.setRes, data})
        if(result.isSuccess){
            dispatch(listApiTreeItems())
        }
    }
}

const deleteApiSet = (params:IPayloadDelApiItem)=>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.delete({url:apiUrl.api.setRes,params})
        if(result.isSuccess){
            dispatch(setToastOpen(true))
            dispatch(listApiTreeItems())
        }
        return result.isSuccess
    }
}

const withdrawDelApiTreeItem = (params:IPayloadDelApiItem)=>{
    return async (dispatch:Dispatch<any>) =>{
        let result = await request.get({url:apiUrl.api.withdraw, params})
        if(result.isSuccess){
            dispatch(setToastOpen(true))
            dispatch(listApiTreeItems())
        }
        return result.isSuccess
    }
}

const addApiGroup = (data:IPayloadAddApiGroup)=>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.post({url:apiUrl.api.groupRes, data})
        if(result.isSuccess){
            dispatch((listApiTreeItems()))
        }
    }
}

const editApiGroup = (data:IPayloadEditApiGroup) =>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.put({url:apiUrl.api.groupRes, data})
        if(result.isSuccess){
            dispatch(listApiTreeItems())
        }
    }
}


const deleteApiGroup = (params:IPayloadDelApiItem)=>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.delete({url: apiUrl.api.groupRes, params})
        if(result.isSuccess){
            dispatch(setToastOpen(true))
            dispatch(listApiTreeItems())
        }
    }
}

const addApiTreeItem = (data:IPayloadAddApiTreeItem)=>{
    return async (dispatch:Dispatch<any>)=>{
        let result =await request.post({url:apiUrl.api.apiTreeItemRes, data})
        if(result.isSuccess){
            dispatch(listApiTreeItems())
        }
    }
}

///删除API
const delApiTreeItem = (params:IPayloadDelApiTreeItem)=>{
    return async (dispatch: Dispatch<any>)=>{
        let result = await  request.delete({url:apiUrl.api.apiTreeItemRes, params})
        if(result.isSuccess){
            dispatch(setToastOpen(true))
            dispatch(listApiTreeItems());
        }
    }
}

const editApiTreeItem = (data:IPayloadEditApiTreeItem)=>{
     return async (dispatch: Dispatch<any>)=>{
         let result = await request.put({url:apiUrl.api.apiTreeItemRes, data})
         if(result.isSuccess){
             dispatch(listApiTreeItems());
         }
     }
}

const listApiTreeItems = ()=>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.get({url:apiUrl.api.treeItemRes})
        if(result.isSuccess){
            dispatch(setApiTreeItems(result.data))
        }
        return result.isSuccess
    }
}

const addApi:(apiItem:{parentId:number, name:string, description?:string})=>void = (apiItem)=>{
    return async (dispatch:Dispatch<any>,getState:any)=>{
        let currentApiSerial = getState().api.currentApiSerial
        let currentApi = getState().api.activeApis.filter((item:API)=>item.serial === currentApiSerial)[0]
        let params = currentApi.params? JSON.stringify(currentApi.params):undefined
        let payload = {
            parentId:apiItem.parentId,
            name:apiItem.name,
            method:currentApi.method,
            url:currentApi.url,
            description: apiItem.description,
            params,
        }
        let result = await _addApi(payload)
        if(result){
            dispatch(listApiTreeItems())
        }
    }
}

const _addApi:(apiItem:{parentId:number,
    name:string,
    method:ApiMethod,
    url?:string,
    params?:string,
    headers?:string,
    bodyJson?:string,
    bodyType?:BodyType,
    testsCode?:string,
    authType?:AuthType,
    authToken?:string,
    pathVars?:string,
    description?:string,
})=>Promise<boolean> = async (apiItem)=>{
    let result = await request.post({url:apiUrl.api.apiRes, data:apiItem})
    return result.isSuccess
}



export const {addActiveApi, setCurrentApiSerial, updateCurrentApi,setApiTreeItems, setToastOpen} = apiSlice.actions

export {editApiTreeItem, addApi, addApiSet,editApiSet,delApiTreeItem, editApiGroup, deleteApiSet,listApiTreeItems,addApiGroup, deleteApiGroup, withdrawDelApiTreeItem, addApiTreeItem};

export default apiSlice.reducer
