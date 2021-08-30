import React, {useEffect} from "react";
import EffTaskGroup from "./eff-task-group";
import './eff-tasks.less'
import {useDispatch, useSelector} from "react-redux";
import {taskThunks} from "@slice/taskSlice";
import {RootState} from "../../store/store";

export default function EffTaskContent(){
    const dispatch = useDispatch()
    const data = {
        groups: useSelector((state:RootState)=>state.task.groups)
    }



    const ui = {
        taskGroups: data.groups.map((item:any, index)=><EffTaskGroup isNew={!item.name && index==data.groups.length-1} id={item.id} name={item.name} key={item.id}/>)
    }

    return (
        <div className="eff-task-content">
            {ui.taskGroups}
        </div>
    )
}
