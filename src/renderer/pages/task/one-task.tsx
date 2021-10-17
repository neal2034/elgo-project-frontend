import React, { useEffect, useState } from 'react';
import './eff-tasks.less';
import { Checkbox } from 'antd';
import EffUser from '@components/eff-user/eff-user';
import { useDispatch } from 'react-redux';
import { taskThunks } from '@slice/taskSlice';
import EffTaskStatus from '../../components/business/eff-task-status/eff-task-status';
import EffPriority from '../../components/business/eff-priority/eff-priority';

interface ITask{
    name:string,
    priority:string,
    status:string,
    id:number,
    serial:number,
    handlerDto?:{
        name:string,
        id:number,
        avatar?:string,
    },
    deadline?:string,
}

interface IProps{
    task:ITask,
    onSelect:()=>void
}

export default function OneTask(props:IProps) {
    const dispatch = useDispatch();
    const { task, onSelect } = props;
    const {
        name, serial, priority, deadline, status, handlerDto, id,
    } = task;
    const [isTaskDone, setIsTaskDone] = useState(false);

    useEffect(() => {
        setIsTaskDone(status === 'DONE');
    }, [status]);

    const response = {
        taskDone: (event:any) => {
            event.stopPropagation();
            setIsTaskDone(event.target.checked);
            if (event.target.checked) {
                dispatch(taskThunks.markTaskDone(id));
            } else {
                dispatch(taskThunks.markTaskUnDone({ id }));
            }
        },
        handleTaskSelected: (event:any) => {
            if (event.target.type !== 'checkbox') {
                onSelect();
            }
        },
    };

    return (
        <div
            onClick={response.handleTaskSelected}
            className="eff-one-task"
            style={{
                paddingLeft: '100px',
                paddingRight: '20px',
            }}
        >
            <div className={`d-flex align-center justify-between task-inner ${isTaskDone ? 'is-done' : ''}`}>
                <div className="d-flex">
                    <Checkbox style={{ zIndex: 10 }} checked={isTaskDone} onChange={response.taskDone} />
                    <span className="ml20">{serial}</span>
                    <span className="ml20">{name}</span>
                </div>
                <div className="d-flex align-center">
                    {deadline && <span className="ml10">{deadline.substr(0, 10)}</span>}
                    {handlerDto && <EffUser img={handlerDto.avatar} className="ml10" id={handlerDto.id} name={handlerDto.name} size={20} />}
                    {priority && <EffPriority className="ml10" value={priority} />}
                    <EffTaskStatus value={status} className="ml10" />
                </div>
            </div>

        </div>
    );
}
