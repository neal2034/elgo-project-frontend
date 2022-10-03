import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import apiUrl from '@config/apiUrl';
import request from '../../utils/request';

interface IAddBugDto {
    name: string;
    testerId?: number;
    handlerId?: number;
    description?: string;
    severity?: 'CRASH' | 'SERIOUS' | 'NORMAL' | 'HINT' | 'ADVICE';
    tagIds?: number[];
    testCaseId?: number;
}
interface IBugDetail {
    id: number;
    name: string;
    serial: number;
    creator: string;
    description?: string;
    handlerId?: number;
    testerId?: number;
    severity: string;
    tagIds?: number[];
    status: string;
}

export type TBugSeverity = 'CRASH' | 'SERIOUS' | 'NORMAL' | 'HINT' | 'ADVICE';
export type TBugStatus = 'OPEN' | 'REJECT' | 'FIXED' | 'VERIFIED' | 'WORK_AS_DESIGN' | 'CAN_NOT_REPRODUCE';

export interface IBugSearchParams {
    searchKey?: string;
    testerIds?: string;
    handlerIds?: string;
    severities?: TBugSeverity[];
    tagIds?: number[];
    statusList?: TBugStatus[];
}

export interface IBugListParams extends IBugSearchParams {
    page?: number;
}

const bugSlice = createSlice({
    name: 'bug',
    initialState: {
        bugs: [],
        myBugs: [],
        page: 0,
        total: 0,
        currentBug: {} as IBugDetail,
    },
    reducers: {
        setBugs: (state, action) => {
            state.bugs = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setTotal: (state, action) => {
            state.total = action.payload;
        },
        setCurrentBug: (state, action) => {
            state.currentBug = action.payload;
        },
        setMyBugs: (state, action) => {
            state.myBugs = action.payload;
        },
    },
});

const bugActions = bugSlice.actions;
const bugThunks = {
    listMyBugs: () => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.bug.mine });
        if (result.isSuccess) {
            dispatch(bugActions.setMyBugs(result.data));
        }
    },
    listBugs: (params?: IBugListParams) => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.bug.index, params });
        if (result.isSuccess) {
            dispatch(bugActions.setBugs(result.data.data));
            dispatch(bugActions.setTotal(result.data.total));
            const page = params && params.page ? params.page : 0;
            dispatch(bugActions.setPage(page));
        }
    },
    addBug: (data: IAddBugDto) => async () => {
        const result = await request.post({ url: apiUrl.bug.index, data });
        return result.isSuccess;
    },
    getBugDetail: (id: number) => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.bug.detail, params: { id } });
        if (result.isSuccess) {
            dispatch(bugActions.setCurrentBug(result.data));
        }
    },

    editDescription: (data: { id: number; description?: string }) => async () => {
        await request.put({ url: apiUrl.bug.editDescription, data });
    },
    editBug:
        (data: {
            id: number;
            name?: string;
            testerId?: number;
            handlerId?: number;
            status?: string;
            description?: string;
            severity?: string;
            tagIds?: number[];
        }) =>
        async () => {
            await request.put({ url: apiUrl.bug.index, data });
        },
    deleteBug: (params: { id: number }) => async () => {
        const result = await request.delete({ url: apiUrl.bug.index, params });
        return result.isSuccess;
    },
    withdrawDelBug: (params: { id: number }) => async () => {
        const result = await request.put({ url: apiUrl.bug.withdrawDel, params });
        return result.isSuccess;
    },
};

export { bugActions, bugThunks, IAddBugDto, IBugDetail };

export default bugSlice.reducer;
