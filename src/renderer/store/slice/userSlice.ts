import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import apiUrl from '@config/apiUrl';
import request from '../../utils/request';

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {},
});

const userActions = userSlice.actions;
const userThunks = {
    editUserName: (data:{name:string}) => async (dispatch:Dispatch<any>) => {
        const result = await request.doPut(apiUrl.user.name, data);
        return result.isSuccess;
    },
    changePwd: (data: {oldPassword:string, newPassword:string}) => async (dispatch:Dispatch<any>) => {
        const result = await request.doPost(apiUrl.user.password, data);
        return result.status;
    },
    sendChangeEmailToken: (data:{password:string, email:string}) => async (dispatch:Dispatch<any>) => {
        const result = await request.doPost(apiUrl.user.sendChangeEmailToken, data);
        return result.status;
    },
    changeEmail: (data: {token:string, email:string}) => async (dispatch:Dispatch<any>) => {
        const result = await request.doPost(apiUrl.user.changeEmail, data);
        return result.status;
    },
};

export { userActions, userThunks };

export default userSlice.reducer;
