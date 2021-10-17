import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import apiUrl from '@config/apiUrl';
import request from '../../utils/request';

interface IRequirement {
    id?:number,
    name:string,
    serial?:number,
    description?:string,
    classId?:number,
    versionId?:number,
    sourceId?: number,
    tagIds: number[],
    status?: string,
    creator?:any,

}

interface IRequirementListParams {
    page?:number,
    id?:number,
    name?:string,
    clazzId?:number,
    sourceId?:number,
    versionId?:number,
    tagIds?:number[],

}

type IRequirementOption = Partial<IRequirement>;

interface IReqEdit extends IRequirementOption{
    id:number,
    field: 'NAME' | 'DESCRIPTION' | 'CLAZZ' | 'VERSION' | 'SOURCE' | 'STATUS' | 'TAG'
}

const reqSlice = createSlice({
    name: 'requirement',
    initialState: {
        reqClasses: [], // 需求分类
        reqSources: [], // 需求来源
        reqVersions: [], // 需求版本
        page: 0, // 当前分页索引
        requirements: [], // 当前显示的需求数组
        reqTotal: 0, // 需求总数
        currentReq: {} as IRequirement, // 当前选择的需求

    },
    reducers: {
        setReqClasses: (state, action) => { state.reqClasses = action.payload; },
        setReqSources: (state, action) => { state.reqSources = action.payload; },
        setReqVersions: (state, action) => { state.reqVersions = action.payload; },
        setPage: (state, action) => { state.page = action.payload; },
        setRequirements: (state, action) => { state.requirements = action.payload; },
        setReqTotal: (state, action) => { state.reqTotal = action.payload; },
        setCurrentReq: (state, action) => { state.currentReq = action.payload; },

    },
});

const reqActions = reqSlice.actions;
const reqThunks = {
    // 列出所有需求分类
    listAllReqClasses: () => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.requirementsClass.index });
        if (result.isSuccess) {
            dispatch(reqActions.setReqClasses(result.data));
        }
    },

    // 列出所有需求来源
    listAllReqSource: () => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.requirementsSources.index });
        if (result.isSuccess) {
            dispatch(reqActions.setReqSources(result.data));
        }
    },

    // 列出所有版本信息
    listAllReqVersions: () => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.versions.index });
        if (result.isSuccess) {
            dispatch(reqActions.setReqVersions(result.data));
        }
    },

    // 添加需求
    addRequirement: (requirement: IRequirement) => async (dispatch: Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.requirements.index, data: requirement });
        if (result.isSuccess) {
            dispatch(reqThunks.listPageRequirement({ page: 0 }));
        }
    },

    // 删除需求
    delRequirement: (id:number) => async (dispatch:Dispatch<any>, getState:any) => {
        const { page } = getState().requirement;
        const result = await request.delete({ url: `${apiUrl.requirements.index}/${id}/trash` });
        if (result.isSuccess) {
            dispatch(reqThunks.listPageRequirement({ page }));
        }
        return result.isSuccess;
    },

    // 撤销删除需求
    withdrawDelRequirement: (id: number) => async (dispatch:Dispatch<any>, getState:any) => {
        const { page } = getState().requirement;
        const result = await request.post({ url: `${apiUrl.requirements.index}/${id}/revert` });
        if (result.isSuccess) {
            dispatch(reqThunks.listPageRequirement({ page }));
        }
        return result.isSuccess;
    },

    // 列出需求
    listPageRequirement: (params: IRequirementListParams) => async (dispatch: Dispatch<any>) => {
        const { page = 0 } = params;
        const result = await request.get({ url: apiUrl.requirements.index, params });
        if (result.isSuccess) {
            dispatch(reqActions.setPage(page));
            dispatch(reqActions.setRequirements(result.data.data));
            dispatch(reqActions.setReqTotal(result.data.total));
        }
    },

    // 获取需求详情
    getReqDetail: (id:number) => async (dispatch:Dispatch<any>) => {
        // get detail
        const result = await request.get({ url: apiUrl.requirements.detail, params: { id } });
        if (result.isSuccess) {
            dispatch(reqActions.setCurrentReq(result.data));
        }
    },

    // 需求修改
    editRequirement: (payload:IReqEdit) => async (dispatch:Dispatch<any>) => {
        const result = await request.put({ url: apiUrl.requirements.index, data: payload });
        if (result.isSuccess) {
            dispatch(reqThunks.getReqDetail(payload.id));
        }
    },

    // 添加需求分类
    addReqClazz: (name: string) => async (dispatch: Dispatch<any>) => {
        const data = { name };
        const result = await request.post({ url: apiUrl.requirementsClass.index, data });
        if (result.isSuccess) {
            dispatch(reqThunks.listAllReqClasses());
        }
    },

    delReqClazz: (id:number) => async (dispatch: Dispatch<any>) => {
        const result = await request.delete({ url: `${apiUrl.requirementsClass.index}/${id}` });
        if (result.isSuccess) {
            dispatch(reqThunks.listAllReqClasses());
        }
    },

    editReqClazz: (id:number, name:string) => async (dispatch:Dispatch<any>) => {
        const result = await request.put({ url: apiUrl.requirementsClass.index, data: { name, id } });
        if (result.isSuccess) {
            dispatch(reqThunks.listAllReqClasses());
        }
    },
    // 添加需求来源
    addReqSource: (data:{name:string}) => async () => {
        const result = await request.post({ url: apiUrl.requirementsSources.index, data });
        return result.isSuccess;
    },
    delReqSource: (id:number) => async () => {
        const result = await request.delete({ url: `${apiUrl.requirementsSources.index}/${id}` });
        return result.isSuccess;
    },
    withdrawReqSource: (params:{id:number}) => async (dispatch:Dispatch<any>) => {
        const result = await request.put({ url: apiUrl.requirementsSources.withdraw, params });
        return result.isSuccess;
    },
    editReqSource: (data:{id:number, name:string}) => async () => {
        const result = await request.put({ url: apiUrl.requirementsSources.index, data });
        return result.isSuccess;
    },
};

export { reqActions, reqThunks, IRequirement };
export default reqSlice.reducer;
