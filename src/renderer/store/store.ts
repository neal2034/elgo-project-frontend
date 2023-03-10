import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '@slice/accountSlice';
import orgReducer from '@slice/orgSlice';
import breadcrumbReducer from '@slice/breadcrumbSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import apiReducer from './slice/apiSlice';
import menuReducer from './slice/menuSlice';
import projectSlice from './slice/projectSlice';
import reqSlice from './slice/reqSlice';
import tagSlice from './slice/tagSlice';
import funztionSlice from './slice/funztionSlice';
import taskSlice from './slice/taskSlice';
import testCaseSlice from './slice/testCaseSlice';
import testPlanSlice from './slice/testPlanSlice';
import bugSlice from './slice/bugSlice';
import versionSlice from './slice/versionSlice';
import elgoVersionSlice from './slice/elgoVersionSlice';
import userSlice from './slice/userSlice';

const store = configureStore({
    reducer: {
        account: accountReducer,
        organization: orgReducer,
        breadcrumb: breadcrumbReducer,
        api: apiReducer,
        menu: menuReducer,
        project: projectSlice,
        requirement: reqSlice,
        tag: tagSlice,
        funztion: funztionSlice,
        task: taskSlice,
        testCase: testCaseSlice,
        testPlan: testPlanSlice,
        bug: bugSlice,
        version: versionSlice,
        elgoVersion: elgoVersionSlice,
        user: userSlice,

    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store;
