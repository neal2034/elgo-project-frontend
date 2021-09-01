import React, {useEffect, useState} from "react";
import './eff-tasks.less'
import {Checkbox} from "antd";
import EffPriority from "../../components/business/eff-priority/eff-priority";
import EffUser from "../../components/eff-user/effUser";
import EffTaskStatus from "../../components/business/eff-task-status/eff-task-status";
import {useDispatch} from "react-redux";
import {taskThunks} from "@slice/taskSlice";



interface ITask{
    name:string,
    priority:string,
    status:string,
    id:number,
    serial:number,
    handlerDto?:{
        name:string,
        id:number
    },
    deadline?:string,
}

interface IProps{
    task:ITask,
    onSelect:()=>void
}

export default function OneTask(props:IProps){
    const dispatch = useDispatch()
    const {name,serial,priority,deadline,status, handlerDto, id} = props.task
    const {onSelect} = props
    const [isTaskDone, setIsTaskDone] = useState(false)

    useEffect(()=>{
        setIsTaskDone(status=='DONE')
    },[status])

    const response = {
        taskDone: (status:any)=>{
            setIsTaskDone(status.target.checked)
            dispatch(taskThunks.markTaskDone(id))
        }
    }

    return (<div onClick={onSelect} className="eff-one-task" style={{
        paddingLeft:'100px',
        paddingRight:'20px'
    }}>
        <div className={`d-flex align-center justify-between task-inner ${isTaskDone?'is-done':''}`} >
            <div className="d-flex">
                <Checkbox checked={isTaskDone} onChange={response.taskDone} />
                <span className="ml20">{serial}</span>
                <span className="ml20">{name}</span>
            </div>
            <div className="d-flex align-center">
                {deadline && <span className="ml10">{deadline.substr(0,10)}</span>}
                {handlerDto && <EffUser className="ml10" id={handlerDto.id} name={handlerDto.name} size={20}/>}
                <EffPriority className="ml10" value={priority}/>
                <EffTaskStatus value={status}  className="ml10"/>
            </div>
        </div>


    </div>)

}
