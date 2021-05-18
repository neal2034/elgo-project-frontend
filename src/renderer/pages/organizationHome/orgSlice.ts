import {createSlice} from "@reduxjs/toolkit";



const orgSlice = createSlice({
    name: 'organization',
    initialState:{
        name:'',
        projects:[],
        departments:[],
    },
    reducers:{
        setName:  (state, action) => {
            state.name = action.payload
        },
        setProjects: (state,action)=>{
            state.projects = action.payload
        },
        setDepartments: (state, action)=>{
            state.departments = action.payload
        }
    }
})




export const {setName} = orgSlice.actions

export default orgSlice.reducer
