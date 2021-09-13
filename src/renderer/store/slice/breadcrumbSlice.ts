import {createSlice} from "@reduxjs/toolkit";


const breadcrumbSlice = createSlice({
    name: 'breadcrumb',
    initialState:{
        breadcrumbs:[]
    },
    reducers:{
        setBreadcrumbs: (state, action)=>{
            state.breadcrumbs = action.payload
        }
    }
})

export const {setBreadcrumbs} = breadcrumbSlice.actions
export default breadcrumbSlice.reducer
