import React from "react";
import EffTaskGroupHeader from "./eff-task-group-head";
import {useDispatch} from "react-redux";
import {taskThunks} from "@slice/taskSlice";

interface IProps{
    name:string,
    id:number,
    isNew?:boolean,
}

export default function EffTaskGroup(props:IProps){
    const dispatch = useDispatch()
    const {id, name, isNew=false} = props

    const response = {
        handleEditName: async (name?:string)=>{
            let finalName = name? name:'未命名分组'
            await dispatch(taskThunks.editTaskGroup(id,finalName))
            dispatch(taskThunks.listTaskGroup())
        }
    }

    return (<div className="mb40">
            <EffTaskGroupHeader editName={response.handleEditName} editing={isNew} name={name}/>
    </div>)

}
