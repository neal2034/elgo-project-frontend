import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import apiUrl from '@config/apiUrl';
import request from '../../utils/request';

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
    status: string;
    tagIds:number[],
    [x:string]:any
}

const funztionSlice = createSlice({
    name: 'funztion',
    initialState: {
        funztions: [] as IFunztion[], // 当前所有功能
        page: 0, // 当前分页
        funzTotal: 0, // 功能总数
        currentFunztion: {} as IFunztion,
        reqFunztions: [], // 需求所对应的功能

    },
    reducers: {
        setFunztions: (state, action) => { state.funztions = action.payload; },
        setPage: (state, action) => { state.page = action.payload; },
        setFunzTotal: (state, action) => { state.funzTotal = action.payload; },
        setCurrentFunztion: (state, action) => { state.currentFunztion = action.payload; },
        setReqFunztions: (state, action) => { state.reqFunztions = action.payload; },
    },
});

const funztionActions = funztionSlice.actions;
const funztionThunks = {
    addFunztion: (funztion:any) => async (dispatch:Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.funztion.index, data: funztion });
        if (result.isSuccess) {
            dispatch(funztionThunks.listFunztion({ page: 0 }));
        }
    },
    editFunztion:(funztion:{id:number,name?:string, status?:string,description?:string, reqId?:number})=>async ()=>{
        const result = await request.put({url:apiUrl.funztion.index,data:funztion});
        return result.isSuccess
    },
    getFunztionDetail: (id:number) => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.funztion.detail, params: { id } });
        if (result.isSuccess) {
            dispatch(funztionActions.setCurrentFunztion(result.data));
        }
    },
    listFunztion: (params:IListFunztionParams) => async (dispatch:Dispatch<any>) => {
        const { page = 0 } = params;
        const result = await request.get({ url: apiUrl.funztion.index, params });
        if (result.isSuccess) {
            dispatch(funztionActions.setPage(page));
            dispatch(funztionActions.setFunztions(result.data.data));
            dispatch(funztionActions.setFunzTotal(result.data.total));
        }
        return result.isSuccess;
    },
    // 列出指定需求所对应的功能
    listReqFunztions: (params:{reqId:number}) => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.funztion.index, params: { page: 0, reqId: params.reqId } });
        if (result.isSuccess) {
            dispatch(funztionActions.setReqFunztions(result.data.data));
        }
    },
    // 修改功能标签
    editFunztionTags: (id:number, tagIds:number[]) => async () => {
        const data = { id, tagIds };
        await request.put({ url: apiUrl.funztion.tags, data });
    },
    // 删除功能
    delFunztion: (id:number) => async (dispatch:Dispatch<any>, getState:any) => {
        const { page } = getState().funztion;
        const result = await request.delete({ url: apiUrl.funztion.index, params: { id } });
        if (result.isSuccess) {
            dispatch(funztionThunks.listFunztion({ page }));
        }
        return result.isSuccess;
    },
    // 撤销删除
    withdrawDelFunztion: (id:number) => async (dispatch:Dispatch<any>, getState:any) => {
        const { page } = getState().funztion;
        const result = await request.put({ url: apiUrl.funztion.withdrawDel, params: { id } });
        if (result.isSuccess) {
            dispatch(funztionThunks.listFunztion({ page }));
        }
        return result.isSuccess;
    },
    listWithIds: (params:{ids:number[]}) => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.funztion.withIds, params });
        if (result.isSuccess) {
            dispatch(funztionActions.setFunztions(result.data));
        }
    },
};

export { funztionActions, funztionThunks, IFunztion };
export default funztionSlice.reducer;
