import { createSlice } from '@reduxjs/toolkit';
import apiUrl from '@config/apiUrl';
import { Dispatch } from 'react';
import request from '../../utils/request';

const tagSlice = createSlice({
    name: 'tag',
    initialState: {
        tags: [],
    },
    reducers: {
        setTags: (state, action) => { state.tags = action.payload; },
    },
});

const tagActions = tagSlice.actions;
const tagThunks = {
    listTags: (name?:string) => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.tags.index, params: { name } });
        if (result.isSuccess) {
            dispatch(tagActions.setTags(result.data));
        }
    },
    addTag: (data:{name:string, color:string}) => async (dispatch:Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.tags.index, data });
        return result.isSuccess;
    },
    editTag: (data:{name:string, color:string, id:number}) => async (dispatch:Dispatch<any>) => {
        const result = await request.put({ url: apiUrl.tags.index, data });
        return result.isSuccess;
    },
    // 删除标签
    delTag: (params:{id:number}) => async (dispatch:Dispatch<any>) => {
        const result = await request.delete({ url: apiUrl.tags.index, params });
        return result.isSuccess;
    },
    // 撤销删除标签
    withdrawTag: (params:{id:number}) => async (dispatch:Dispatch<any>) => {
        const result = await request.put({ url: apiUrl.tags.withdrawDel, params });
        return result.isSuccess;
    },
};

export { tagActions, tagThunks };
export default tagSlice.reducer;
