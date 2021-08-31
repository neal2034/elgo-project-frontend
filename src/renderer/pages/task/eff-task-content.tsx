import React, {useEffect} from "react";
import EffTaskGroup from "./eff-task-group";
import './eff-tasks.less'
import {useDispatch, useSelector} from "react-redux";
import {taskThunks} from "@slice/taskSlice";
import {RootState} from "../../store/store";
import {Drawer} from "antd";
import AddTaskForm from "./add-task-form";
import {tagThunks} from "@slice/tagSlice";

export default function EffTaskContent(){
    const dispatch = useDispatch()
    const data = {
        groups: useSelector((state:RootState)=>state.task.groups),
        tags: useSelector((state:RootState)=>state.tag.tags),
    }

    useEffect(()=>{
        dispatch(tagThunks.listTags())
    },[])

    const response = {
        occupy: ()=>{}
    }


    const ui = {
        taskGroups: data.groups.map((item:any, index)=><EffTaskGroup isNew={!item.name && index==data.groups.length-1} id={item.id} name={item.name} key={item.id}/>)
    }

    return (
        <div className="eff-task-content">
            {ui.taskGroups}
            <Drawer
                title={null}
                width={'60%'}
                placement="right"
                closable={false}
                maskClosable={false}
                visible={false}
            >
                <AddTaskForm onConfirm={response.occupy} onCancel={response.occupy} tags={data.tags}/>
            </Drawer>
        </div>
    )
}
