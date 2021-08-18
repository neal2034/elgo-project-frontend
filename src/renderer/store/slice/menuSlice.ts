import {createSlice} from "@reduxjs/toolkit";



const menuSlice = createSlice({
    name: 'menu',
    initialState:{
        activeMenu:'home',
    },
    reducers:{
        setActiveMenu:(state, action)=>{
            state.activeMenu = action.payload
        }
    }
})

const menuActions = menuSlice.actions;
export {menuActions}
export default menuSlice.reducer
