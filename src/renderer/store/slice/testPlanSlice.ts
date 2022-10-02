import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import apiUrl from '@config/apiUrl';
import request from '../../utils/request';

interface ITestPlanDetail {
    id: number;
    serial: number;
    name: string;
    funztionIds?: number[];
    creator: string;
    addAt: string;
    status: string;
}

interface IPlanCase {
    id: number;
    [x: string]: any;
}

const testPlanSlice = createSlice({
    name: 'testPlan',
    initialState: {
        page: 0,
        total: 0,
        testPlans: [],
        currentTestPlan: {} as ITestPlanDetail,
        planCases: [] as IPlanCase[],
        casePage: 0,
        totalCaseNum: 0,
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setTotal: (state, action) => {
            state.total = action.payload;
        },
        setTestPlans: (state, action) => {
            state.testPlans = action.payload;
        },
        setCurrentTestPlan: (state, action) => {
            state.currentTestPlan = action.payload;

            // change funztion ids from string array to number array
            const { funztionIds } = action.payload;
            if (funztionIds && funztionIds.length > 0) {
                state.currentTestPlan.funztionIds = funztionIds.map(item => parseInt(item, 10));
            }
        },
        setPlanCases: (state, action) => {
            state.planCases = action.payload;
        },
        setCasePage: (state, action) => {
            state.casePage = action.payload;
        },
        setTotalCaseNum: (state, action) => {
            state.totalCaseNum = action.payload;
        },
    },
});

const testPlanActions = testPlanSlice.actions;
const testPlanThunks = {
    listTestPlan: (params?: { page?: number; key?: string; status?: string }) => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.testPlan.index, params });
        const page = params && params.page ? params.page : 0;
        if (result.isSuccess) {
            dispatch(testPlanActions.setTotal(result.data.total));
            dispatch(testPlanActions.setTestPlans(result.data.data));
            dispatch(testPlanActions.setPage(page));
        }
    },
    addTestPlan: (data: { name: string; funztionIds?: number[] }) => async () => {
        await request.post({ url: apiUrl.testPlan.index, data });
    },
    delTestPlan: (id: number) => async () => {
        const result = await request.delete({ url: apiUrl.testPlan.index, params: { id } });
        return result.isSuccess;
    },
    withdrawDelTestPlan: (params: { id: number }) => async () => {
        const result = await request.put({ url: apiUrl.testPlan.withdrawDel, params });
        return result.isSuccess;
    },
    getTestPlanDetail: (params: { id: number }) => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.testPlan.detail, params });
        if (result.isSuccess) {
            dispatch(testPlanActions.setCurrentTestPlan(result.data));
        }
    },

    listPlanCase: (params: { planId: number; page?: number; caseName?: string; status?: string; funztionId?: number }) => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.testPlan.planCase, params });
        if (result.isSuccess) {
            dispatch(testPlanActions.setPlanCases(result.data.data));
            dispatch(testPlanActions.setTotalCaseNum(result.data.total));
            const page = params && params.page ? params.page : 0;
            dispatch(testPlanActions.setCasePage(page));
        }
    },
    editTestPlan: (testPlan: { id: number; name?: string; status?: string; funztionIds?: number[] }) => async () => {
        const result = await request.put({ url: apiUrl.testPlan.index, data: testPlan });
        return result.isSuccess;
    },
};

export { testPlanActions, testPlanThunks, ITestPlanDetail, IPlanCase };
export default testPlanSlice.reducer;
