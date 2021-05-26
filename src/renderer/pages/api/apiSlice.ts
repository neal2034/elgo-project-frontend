import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface API{
    name:string,
    serial:number,
    isExample?:boolean,     //是否为用例
    method:string,          //GET/POST/DELETE/PUT
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
        }
    }
})

export const {addActiveApi, setCurrentApiSerial} = apiSlice.actions

export default apiSlice.reducer
