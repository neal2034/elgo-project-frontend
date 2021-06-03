import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import request from "../../utils/request";
import apiUrl from '../../config/apiUrl'
import {Dispatch} from "react";

export interface ApiParams{
    paramKey?:string,
    paramValue?:string,
    description?:string,
    selected?:boolean,
    key:number,
}

export interface API{
    name:string,
    serial:number,
    isExample?:boolean,     //是否为用例
    method:string,          //GET/POST/DELETE/PUT
    params:ApiParams[],
}

interface IPayloadAddApiSet {
    name:string,
    description?:string,
    authToken?:string,
    authType:'NONE'|'INHERIT'|'BEARER',
}

interface IPayloadAddApiGroup {
    name:string,
    description?:string,
    authToken?:string,
    authType:'NONE'|'INHERIT'|'BEARER',
    parentId:number,
}


let activeApis: Array<API> = []


const apiSlice = createSlice({
    name: 'api',
    initialState:{
        activeApis:activeApis,
        currentApiSerial:null,
        apiTreeItems:[],

    },
    reducers:{
        addActiveApi:(state, action:PayloadAction<API>)=>{
            state.activeApis.push(action.payload)
        },
        //设置当前激活的API
        setCurrentApiSerial:(state, action)=>{
            state.currentApiSerial = action.payload
        },
        updateCurrentApi:(state, action) => {
            state.activeApis.forEach(item=>{
                if(item.serial === state.currentApiSerial){
                    Object.assign(item, action.payload)
                }
            })
        },
        setApiTreeItems:(state, action)=>{
            state.apiTreeItems = action.payload
        }
    }
})




const addApiSet = (data:IPayloadAddApiSet)=>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.post({url: apiUrl.api.setRes, data})
        if(result.isSuccess){
            dispatch(listApiTreeItems())
        }
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

const listApiTreeItems = ()=>{
    return async (dispatch:Dispatch<any>)=>{
        let result = await request.get({url:apiUrl.api.treeItemRes})
        if(result.isSuccess){
            dispatch(setApiTreeItems(result.data))
        }
        return result.isSuccess
    }
}

export const {addActiveApi, setCurrentApiSerial, updateCurrentApi,setApiTreeItems} = apiSlice.actions

export {addApiSet, listApiTreeItems,addApiGroup};

export default apiSlice.reducer
