import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../pages/account/accountSlice'
import orgReducer from '../pages/organizationHome/orgSlice'


let store = configureStore({
    reducer:{
        account:accountReducer,
        organization:orgReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export default store
