import React, {useEffect, useState} from "react";
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
    const [activeGroupId, setActiveGroupId] = useState(-1);       //当前用于添加任务的分组ID
    const [showAddTaskFrom, setShowAddTaskForm] = useState(false);    //是否打开添加任务对话框
    const data = {
        groups: useSelector((state:RootState)=>state.task.groups),
        tags: useSelector((state:RootState)=>state.tag.tags),
    }

    useEffect(()=>{
        dispatch(tagThunks.listTags())
    },[])

    const response = {
        goAddTask: (id:number)=>{
            setActiveGroupId(id)
            setShowAddTaskForm(true)
        },
        handleAddTask: async (task:any)=>{
            let deadline = task.deadline? task.deadline.format('YYYY-MM-DD 00:00:00'):undefined
            let payload = Object.assign({taskListId:activeGroupId}, task, {deadline})
            await dispatch(taskThunks.addTask(payload))
            dispatch(taskThunks.listTask(activeGroupId))
            setShowAddTaskForm(false)

        },
        handleCancelAdd: ()=>{
            setActiveGroupId(-1)
            setShowAddTaskForm(false)
        }
    }


    const ui = {
        taskGroups: data.groups.map((item:any, index)=><EffTaskGroup onAdd={response.goAddTask}   isNew={!item.name && index==data.groups.length-1} id={item.id} name={item.name} key={item.id}/>)
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
                visible={showAddTaskFrom}
            >
                <AddTaskForm onConfirm={response.handleAddTask} onCancel={response.handleCancelAdd} tags={data.tags}/>
            </Drawer>
        </div>
    )
}
