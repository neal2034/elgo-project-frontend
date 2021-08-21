import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../pages/account/accountSlice'
import orgReducer from '../pages/organizationHome/orgSlice'
import breadcrumbReducer from './breadcrumbSlice'
import apiReducer from  './slice/apiSlice'
import menuReducer from './slice/menuSlice'
import projectSlice from './slice/projectSlice'
import reqSlice from './slice/reqSlice'
import tagSlice from './slice/tagSlice'



let store = configureStore({
    reducer:{
        account:accountReducer,
        organization:orgReducer,
        breadcrumb:breadcrumbReducer,
        api:apiReducer,
        menu:menuReducer,
        project:projectSlice,
        requirement: reqSlice,
        tag:tagSlice


    },
})

export type RootState = ReturnType<typeof store.getState>
export default store
