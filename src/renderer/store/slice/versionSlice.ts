import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import apiUrl from '@config/apiUrl';
import request from '../../utils/request';

const versionSlice = createSlice({
    name: 'version',
    initialState: {
        versions: [],
    },
    reducers: {
        setVersions: (state, action) => { state.versions = action.payload; },
    },
});

const versionAction = versionSlice.actions;
const versionThunks = {
    listVersions: () => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.versions.index });
        if (result.isSuccess) {
            dispatch(versionAction.setVersions(result.data));
        }
    },
    addVersion: (data:{name:string}) => async (dispatch:Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.versions.index, data });
        return result.isSuccess;
    },
    editVersion: (data:{name:string, id:number}) => async (dispatch:Dispatch<any>) => {
        const result = await request.put({ url: apiUrl.versions.index, data });
        return result.isSuccess;
    },
    delVersion: (id:number) => async (dispatch:Dispatch<any>) => {
        const result = await request.delete({ url: `${apiUrl.versions.index}/${id}` });
        return result.isSuccess;
    },
    withdrawDel: (params:{id:number}) => async (dispatch:Dispatch<any>) => {
        const result = await request.put({ url: apiUrl.versions.withdraw, params });
        return result.isSuccess;
    },

};

export { versionAction, versionThunks };
export default versionSlice.reducer;
