import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../pages/account/accountSlice'
import orgReducer from '../pages/organizationHome/orgSlice'
import breadcrumbReducer from '@slice/breadcrumbSlice'
import apiReducer from  './slice/apiSlice'
import menuReducer from './slice/menuSlice'
import projectSlice from './slice/projectSlice'
import reqSlice from './slice/reqSlice'
import tagSlice from './slice/tagSlice'
import funztionSlice from './slice/funztionSlice'
import taskSlice from './slice/taskSlice'
import testCaseSlice from './slice/testCaseSlice'
import testPlanSlice from './slice/testPlanSlice'
import bugSlice from './slice/bugSlice'



const store = configureStore({
    reducer:{
        account:accountReducer,
        organization:orgReducer,
        breadcrumb:breadcrumbReducer,
        api:apiReducer,
        menu:menuReducer,
        project:projectSlice,
        requirement: reqSlice,
        tag:tagSlice,
        funztion:funztionSlice,
        task: taskSlice,
        testCase:testCaseSlice,
        testPlan:testPlanSlice,
        bug:bugSlice,


    },
})

export type RootState = ReturnType<typeof store.getState>
export default store
