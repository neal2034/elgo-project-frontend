import { createSlice } from '@reduxjs/toolkit';

import apiUrl from '@config/apiUrl';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import umbrella from 'umbrella-storage';
import globalConfig from '@config/global.config';
import { Dispatch } from 'react';
import { setName } from './orgSlice';
import request from '../../utils/request';

interface PayloadLogin {
    username:string,
    password:string,
}

// 描述返回的User
interface IUser{
    id:number,
    username:string,
    name:string,
    avatar?:string,
    boolEnable:boolean
}

const accountSlice = createSlice({
    name: 'account',
    initialState: {
        memberName: null,
        memberEmail: null,
        currentMember: {},
        currentUser: {} as IUser,
        signupUserExist: false, // 注册的用户是否已存在
        signupEmailSent: false, // 注册邮件是否已发送
    },
    reducers: {
        setMemberName: (state, action) => {
            state.memberName = action.payload;
        },
        setMemberEmail: (state, action) => {
            state.memberEmail = action.payload;
        },
        setCurrentMember: (state, action) => {
            state.currentMember = action.payload;
        },
        setSignupUserExist: (state, action) => { state.signupUserExist = action.payload; },
        setSignupEmailSent: (state, action) => { state.signupEmailSent = action.payload; },
        setCurrentUser: (state, action) => { state.currentUser = action.payload; },
    },
});
const accountActions = accountSlice.actions;

export const login = (data:PayloadLogin): ThunkAction<void, unknown, unknown, AnyAction> => async (dispatch) => {
    const baseURL = globalConfig.baseUrl.replace(globalConfig.apiPrefix, '');
    const result = await request.post({ url: apiUrl.user.login, data, config: { baseURL } });
    if (result.isSuccess) {
        umbrella.setLocalStorage('token', result.data.token);
        // 获取组织列表
        const loginOrg = await request.get({ url: apiUrl.organization.getLogin });
        if (loginOrg.isSuccess) {
            umbrella.setLocalStorage('oserial', loginOrg.data.serial);
            dispatch(setName(loginOrg.data.name));
        }
    }
    return result.isSuccess;
};

const accountThunks = {
    clearLocalStorage: () => async () => {
        umbrella.setLocalStorage('token', null);
        umbrella.setLocalStorage('oserial', null);
        umbrella.setLocalStorage('pserial', null);
    },
    getCurrentMember: () => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.orgMember.currentMember });
        if (result.isSuccess) {
            dispatch(accountSlice.actions.setMemberName(result.data.name));
            dispatch(accountSlice.actions.setMemberEmail(result.data.email));
            dispatch(accountSlice.actions.setCurrentMember(result.data));
        }
    },
    getCurrentUser: () => async (dispatch: Dispatch<any>) => {
        const result = await request.doGet(apiUrl.user.userRes);
        if (result.isSuccess) {
            dispatch(accountActions.setCurrentUser(result.data));
        }
        return result.isSuccess;
    },
    signup: (data:{email:string, code:string}) => async (dispatch:Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.user.signup, data });
        if (result.isSuccess) {
            dispatch(accountActions.setSignupUserExist(result.data.userExist));
            dispatch(accountActions.setSignupEmailSent(result.data.emailSent));
        }
        return result.isSuccess;
    },
    resentSignUp: (data:{email:string}) => async (dispatch:Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.user.resent, data });
        return result.isSuccess;
    },
};

export { accountActions, accountThunks, IUser };
export default accountSlice.reducer;
