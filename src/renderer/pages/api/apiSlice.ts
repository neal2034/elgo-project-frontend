import {createSlice, PayloadAction} from "@reduxjs/toolkit";


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


let activeApis: Array<API> = []


const apiSlice = createSlice({
    name: 'api',
    initialState:{
        activeApis:activeApis,
        currentApiSerial:null,

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
    }
})

export const {addActiveApi, setCurrentApiSerial, updateCurrentApi} = apiSlice.actions

export default apiSlice.reducer
