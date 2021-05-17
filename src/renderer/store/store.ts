import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../pages/account/accountSlice'


let store = configureStore({
    reducer:{
        account:accountReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export default store
