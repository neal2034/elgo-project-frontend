import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import request from "../../utils/request";
import apiUrl from "@config/apiUrl";

interface IRequirement  {
    name:string|null,
    description:string|null,
    classId:number|null,
    versionId:number|null,
    sourceId: number|null,
    tagIds: number[],

}

interface IRequirementListParams {
    page?:number,
    name?:string,
}

const reqSlice = createSlice({
    name:'requirement',
    initialState:{
        reqClasses:[],      //需求分类
        reqSources:[],       //需求来源
        reqVersions:[],     //需求版本
        page:0,             //当前分页索引
        requirements:[],     //当前显示的需求数组
        reqTotal:0,         //需求总数
    },
    reducers:{
        setReqClasses: (state, action) => {state.reqClasses = action.payload},
        setReqSources: (state, action) => {state.reqSources = action.payload},
        setReqVersions: (state, action) => {state.reqVersions = action.payload},
        setPage: (state, action) => { state.page = action.payload },
        setRequirements: (state, action) => { state.requirements = action.payload },
        setReqTotal: (state, action) => { state.reqTotal = action.payload },
    }
})

const reqActions = reqSlice.actions
const reqThunks = {
    //列出所有需求分类
    listAllReqClasses: () => {
        return async (dispatch: Dispatch<any>) => {
            let result = await request.get({url: apiUrl.requirementsClass.index})
            if (result.isSuccess) {
                dispatch(reqActions.setReqClasses(result.data))
            }
        }
    },

    //列出所有需求来源
    listAllReqSource: () => {
        return async (dispatch: Dispatch<any>) => {
            let result = await request.get({url: apiUrl.requirementsSources.index})
            if (result.isSuccess) {
                dispatch(reqActions.setReqSources(result.data))
            }
        }
    },

    //列出所有版本信息
    listAllReqVersions: () => {
        return async (dispatch: Dispatch<any>) => {
            let result = await request.get({url: apiUrl.versions.index})
            if (result.isSuccess) {
                dispatch(reqActions.setReqVersions(result.data))
            }
        }
    },

    //添加需求
    addRequirement: (requirement: IRequirement) => {
        return async (dispatch: Dispatch<any>) => {

        }
    },

    //列出需求
    listPageRequirement: (params: IRequirementListParams) => {
        return async (dispatch: Dispatch<any>) => {
            const {page = 0} = params
            let result = await request.get({url: apiUrl.requirements.index, params})
            if (result.isSuccess) {
                dispatch(reqActions.setPage(page))
                dispatch(reqActions.setRequirements(result.data.data))
                dispatch(reqActions.setReqTotal(result.data.total))
            }
        }
    },

    //添加需求分类
    addReqClazz: (name: string) => {
        return async (dispatch: Dispatch<any>) => {
            let data = {name}
            let result = await request.post({url: apiUrl.requirementsClass.index, data})
            if (result.isSuccess) {
                dispatch(reqThunks.listAllReqClasses())
            }
        }
    },

    delReqClazz: (id:number) => {
        return async (dispatch: Dispatch<any>) => {
            let result = await request.delete({url:`${apiUrl.requirementsClass.index}/${id}`})
            if(result.isSuccess){
                dispatch(reqThunks.listAllReqClasses())
            }
        }
    },

    editReqClazz : (id:number,name:string)=>{
            return async (dispatch:Dispatch<any>)=>{
                 let result = await request.put({url:apiUrl.requirementsClass.index,data:{name,id}})
                if(result.isSuccess){
                    dispatch(reqThunks.listAllReqClasses())
                }
            }
        }
}




export {reqActions, reqThunks}
export default reqSlice.reducer
