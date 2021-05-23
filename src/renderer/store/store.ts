import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../pages/account/accountSlice'
import orgReducer from '../pages/organizationHome/orgSlice'
import breadcrumbReducer from './breadcrumbSlice'


let store = configureStore({
    reducer:{
        account:accountReducer,
        organization:orgReducer,
        breadcrumb:breadcrumbReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export default store
