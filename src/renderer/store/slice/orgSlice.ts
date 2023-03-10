import { createSlice } from '@reduxjs/toolkit';
import apiUrl from '@config/apiUrl';
import { Dispatch } from 'react';
import request from '../../utils/request';

const orgSlice = createSlice({
    name: 'organization',
    initialState: {
        name: '',
        projects: [],
        departments: [],
        organization: {} as any, // 当前组织
        orgList: [],
        activeUserStatus: -2, // 当前待激活用户状态 1=当前激活token无效 -1=User已存在输入密码即可 0=表示没有对应User, -2=无效初始态
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setDepartments: (state, action) => {
            state.departments = action.payload;
        },
        setOrganization: (state, action) => {
            state.organization = action.payload;
            state.name = action.payload.name;
        },
        setOrganizationList: (state, action) => {
            state.orgList = action.payload;
        },
        setActiveUserStatus: (state, action) => {
            state.activeUserStatus = action.payload;
        },
    },
});
const orgActions = orgSlice.actions;

// 获取组织详情
export const getOrganizationDetail = () => async (dispatch: Dispatch<any>) => {
    const result = await request.get({ url: apiUrl.organization.detail });
    if (result.isSuccess) {
        dispatch(orgSlice.actions.setOrganization(result.data));
    }
};

export const listProjects = () => async (dispatch: Dispatch<any>) => {
    const result = await request.get({ url: apiUrl.project.projectRes });
    if (result.isSuccess) {
        const projects = result.data.filter((item: any) => item.type === 'PROJECT');
        const departments = result.data.filter((item: any) => item.type === 'DEPARTMENT');
        dispatch(orgSlice.actions.setProjects(projects));
        dispatch(orgSlice.actions.setDepartments(departments));
    }
};

export const orgThunks = {
    getOrganizationDetail: () => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.organization.detail });
        if (result.isSuccess) {
            dispatch(orgSlice.actions.setOrganization(result.data));
            dispatch(orgSlice.actions.setName(result.data.name));
        }
    },
    listOrganizations: () => async (dispatch: Dispatch<any>) => {
        const orgs = await request.get({ url: apiUrl.organization.orgRes });
        if (orgs.isSuccess) {
            dispatch(orgSlice.actions.setOrganizationList(orgs.data));
        }
    },
    setLastLoginOrg: () => () => {
        request.put({ url: apiUrl.organization.lastLogin });
    },
    inviteMember: (data: { members: { email: string }[] }) => async () => {
        const result = await request.post({ url: apiUrl.orgMember.index, data });
        return result.isSuccess;
    },
    addOrganization: (data: { name: string; password: string; token: string }) => async () => {
        const result = await request.post({ url: apiUrl.organization.addOrg, data });
        return result.isSuccess;
    },
    addAnotherOrganization: (data: { name: string }) => async (dispatch: Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.organization.orgRes, data });
        return result.isSuccess;
    },
    removeOrgMember: (params: { id: number }) => async (dispatch: Dispatch<any>) => {
        const result = await request.delete({ url: apiUrl.orgMember.index, params });
        return result.isSuccess;
    },
    cancelInvitation: (params: { id: number }) => async () => {
        const result = await request.put({ url: apiUrl.orgMember.cancelInvitation, params });

        return result.isSuccess;
    },
    // 检测成员邀请token 的有效性
    checkInviteToken: (params: { token: string }) => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.orgMember.checkInvitationToken, params });
        let status = -2;
        if (result.status === 100005) {
            // token 不存在或已被使用
            status = 1;
        } else if (result.status === 100001) {
            status = -1;
        } else {
            status = 0;
        }
        dispatch(orgActions.setActiveUserStatus(status));
    },
    // 激活用户
    activeUser: (data: { token: string; password: string; boolNew: boolean }) => async (dispatch: Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.orgMember.active, data });
        // const result = await request.post({ url: apiUrl.organization.activeMember, data });
        return result.isSuccess;
    },
};

export const { setName } = orgSlice.actions;

export { orgActions };

export default orgSlice.reducer;
