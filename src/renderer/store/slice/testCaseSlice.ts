import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import apiUrl from '@config/apiUrl';
import request from '../../utils/request';

interface ITestCaseDetail{
    id:number,
    serial:number,
    name:string,
    description?:string,
    priority:string,
    funztionId?:number,
    tagIds?:number[],
    creator:{
        name:string,
        id:number
    }
}

const testCaseSlice = createSlice({
    name: 'testCase',
    initialState: {
        testCases: [],
        funztionCases: [], // 具体功能对应的测试用例
        page: 0,
        total: 0,
        currentTestCase: {} as ITestCaseDetail,
    },
    reducers: {
        setTestCases: (state, action) => { state.testCases = action.payload; },
        setPage: (state, action) => { state.page = action.payload; },
        setTotal: (state, action) => { state.total = action.payload; },
        setCurrentTestCase: (state, action) => { state.currentTestCase = action.payload; },
        setFunztionCases: (state, action) => { state.funztionCases = action.payload; },
    },
});

const testCaseActions = testCaseSlice.actions;
const testCaseThunks = {
    listTestCase: (params:{page:number, searchKey?:string, funztionId?:number, tagIds?:number[],
        priorities?:string[] }) => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.testCase.index, params });
        if (result.isSuccess) {
            dispatch(testCaseActions.setPage(params.page));
            dispatch(testCaseActions.setTotal(result.data.total));
            dispatch(testCaseActions.setTestCases(result.data.data));
        }
    },
    listFunztionCases: (params:{page:number, funztionId:number}) => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.testCase.index, params });
        if (result.isSuccess) {
            dispatch(testCaseActions.setFunztionCases(result.data.data));
        }
    },
    addTestCase: (data:{name:string, description?:string, priority:string, funztionId?:number, tagIds?:number[]}) => async () => {
        const payload:any = { ...data };
        await request.post({ url: apiUrl.testCase.index, data: payload });
    },
    getTestCaseDetail: (id:number) => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.testCase.detail, params: { id } });
        if (result.isSuccess) {
            dispatch(testCaseActions.setCurrentTestCase(result.data));
        }
    },
    editTags: (data:{id:number, tagIds?:number[]}) => async () => {
        await request.put({ url: apiUrl.testCase.editTag, data });
    },
    deleteTestCase: (id:number) => async () => {
        const result = await request.delete({ url: apiUrl.testCase.index, params: { id } });
        return result.isSuccess;
    },
    withdrawDelTestCase: (id:number) => async () => {
        const result = await request.put({ url: apiUrl.testCase.withdrawDel, params: { id } });
        return result.isSuccess;
    },
    editTestCase: (testCases:{id:number, name?:string,funztionId?:number, priority?:string, description?:string})=>async ()=>{
        const result = await request.put({url:apiUrl.testCase.index, data:testCases})
        return result.isSuccess
    }

};

export { testCaseActions, testCaseThunks, ITestCaseDetail };
export default testCaseSlice.reducer;
