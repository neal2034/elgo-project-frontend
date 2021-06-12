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
    treeItemId?:number,
    exampleName?:string,
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
        pushActiveApi:(state,action)=>{
            state.currentApiSerial = action.payload.serial
            state.activeApis.push(action.payload)
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

        },
        removeActiveApi:(state, action)=>{
            let serial = action.payload
            let removeIndex:number=-1
            state.activeApis.forEach((item,index)=>{
                if(item.serial=== serial){
                    removeIndex = index;
                }
            })
            state.activeApis.splice(removeIndex,1);
            //如果没有可激活的api，则设置当前激活序列号为null
            let activeSerial = state.currentApiSerial;

            if(state.activeApis.length===0){
                //如果工作区API数组为空，则没有可激活API
                activeSerial = -1;
            }else if(serial === activeSerial){
                if(removeIndex===0){
                    //如果当前删除的API为第一个， 则设置第二个
                    activeSerial =  state.activeApis[0].serial;
                }else{
                    activeSerial = state.activeApis[removeIndex-1].serial;
                }
            }
            state.currentApiSerial = activeSerial
        },
        setCurrentApiSaved:(state)=>{
            state.activeApis.forEach(item=>{
                if(item.serial === state.currentApiSerial){
                    Object.assign(item,  {dirty:false})
                }
            })
        },

        addApiExample:(state)=>{
            let serial = getUsableSerial(state.activeApis)
            let currentApi = state.activeApis.filter(item=>item.serial===state.currentApiSerial)[0]
            const {url, name, method, params, headers, bodyType, bodyJson, responseBody} = currentApi
            let examplePart = {url, name, method, params, headers, bodyType, bodyJson, responseBody, apiId:currentApi.id, exampleName:currentApi.name, dirty:true,}
            let apiExample = Object.assign({},{serial, isExample:true}, examplePart )
            state.activeApis.push(apiExample)
            state.currentApiSerial = serial
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
        let headers = currentApi.headers? JSON.stringify(currentApi.headers):undefined
        let pathVars = currentApi.pathVars? JSON.stringify(currentApi.pathVars):undefined
        let payload = {
            parentId:apiItem.parentId,
            name:apiItem.name,
            method:currentApi.method.toUpperCase(),
            url:currentApi.url,
            description: apiItem.description,
            authType:currentApi.authType,
            authToken:currentApi.authToken,
            bodyType:currentApi.bodyType,
            bodyJson:currentApi.bodyJson,
            testsCode:currentApi.testsCode,
            params,
            headers,
            pathVars,
        }
        let result = await _addApi(payload)
        if(result.isSuccess){
            dispatch(listApiTreeItems())
            dispatch(updateCurrentApi({name:apiItem.name, id:result.data.id, treeItemId:result.data.treeItemId}))
            dispatch(setCurrentApiSaved())

        }
    }
}

const editApi:()=>void  = ()=>{
    return async (dispatch:Dispatch<any>, getState:any) =>{
        let currentApiSerial = getState().api.currentApiSerial
        let currentApi = getState().api.activeApis.filter((item:API)=>item.serial === currentApiSerial)[0]
        let params = currentApi.params? JSON.stringify(currentApi.params):undefined
        let headers = currentApi.headers? JSON.stringify(currentApi.headers):undefined
        let pathVars = currentApi.pathVars? JSON.stringify(currentApi.pathVars):undefined
        let payload = {...currentApi}
        payload.params = params
        payload.headers = headers
        payload.pathVars = pathVars
        payload.method = payload.method.toUpperCase()
        if(payload.pathVars && payload.pathVars.length === 0){
           delete  payload.pathVars
        }
        delete payload.treeItemId
        delete payload.parentId
        delete payload.examples
        delete payload.serial
        delete payload.dirty
        delete payload.isExample
        let result = await  request.put({url:apiUrl.api.apiRes, data:payload})
        if(result.isSuccess){
            dispatch(setCurrentApiSaved())
        }
        return result


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
})=>any = async (apiItem)=>{
    let result = await request.post({url:apiUrl.api.apiRes, data:apiItem})
    return result
}


const apiSelected = (id:number)=>{
    return async (dispatch:Dispatch<any>, getState:any)=>{
        let activeApis = getState().api.activeApis;
        let activeApi = activeApis.filter((item:API)=>item.treeItemId===id)[0]
        if(activeApi){
            //如果当前tree item id在激活API内，则直接激活
            dispatch(setCurrentApiSerial(activeApi.serial))
        }else{
            //如果指定 tree item id不在激活API内， 则获取API详情，并激活

            let result = await request.get({url:apiUrl.api.apiViaTreeItem, params:{treeItemId:id}})
            if(result.isSuccess){
                let apiData = result.data
                let serial = getUsableSerial(activeApis)
                let theApi = Object.assign({}, apiData, {serial,dirty:false})
                theApi.params = theApi.params? JSON.parse(theApi.params):[{key:0}];
                theApi.headers = theApi.headers? JSON.parse(theApi.headers):[{key:0}];
                if(theApi.pathVars){
                    theApi.pathVars = JSON.parse(theApi.pathVars)
                }
                console.log("here is the api ", theApi)
                dispatch(pushActiveApi(theApi))
            }

        }
    }
}


export const apiThunks = {
    saveApiExample: () => {
        return async (dispatch:Dispatch<any>, getState:any)=>{
            let currentApiSerial = getState().api.currentApiSerial
            let currentApi = getState().api.activeApis.filter((item:API)=>item.serial === currentApiSerial)[0]
            let {url, bodyType, bodyJson, method} = currentApi
            let apiExample = {url, bodyType, bodyJson, method,
                name:currentApi.exampleName,
                response:currentApi.responseBody? JSON.stringify(currentApi.responseBody):null,
                params:currentApi.params? JSON.stringify(currentApi.params):null,
                headers:currentApi.headers? JSON.stringify(currentApi.headers):null,
                pathVars:currentApi.pathVars? JSON.stringify(currentApi.pathVars):null,
                id:undefined,
                apiId: undefined
            }
            let isSaved = !!currentApi.id
            let result;
            if(isSaved){
                apiExample.id = currentApi.id
                result = await request.put({url:apiUrl.apiExample.apiExampleRes, data:apiExample})
            }else{
                apiExample.apiId = currentApi.apiId
                result = await request.post({url:apiUrl.apiExample.apiExampleRes, data:apiExample})
            }
            if(result.isSuccess){
                dispatch(setCurrentApiSaved());
            }

        }
    }
}


const apiActions = apiSlice.actions
export {apiActions};

export const {addActiveApi, addApiExample, setCurrentApiSaved, setCurrentApiSerial, updateCurrentApi,setApiTreeItems, setToastOpen, pushActiveApi, removeActiveApi} = apiSlice.actions

export {editApiTreeItem,editApi, apiSelected, addApi, addApiSet,editApiSet,delApiTreeItem, editApiGroup, deleteApiSet,listApiTreeItems,addApiGroup, deleteApiGroup, withdrawDelApiTreeItem, addApiTreeItem};

export default apiSlice.reducer
