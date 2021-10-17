import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { taskThunks } from '@slice/taskSlice';
import { UNDONE_TASK } from '@config/sysConstant';
import EffTaskGroupHeader from './eff-task-group-head';
import { RootState } from '../../store/store';
import OneTask from './one-task';

interface IProps{
    name:string,
    id:number,
    isNew?:boolean,
    onAdd:(id:number)=>void,
    onTaskSelected:(id:number)=>void,
}

export default function EffTaskGroup(props:IProps) {
    const dispatch = useDispatch();
    const {
        id, name, isNew = false, onAdd, onTaskSelected,
    } = props;

    const taskItems = useSelector((state:RootState) => state.task.tasks[id]);
    const usableTaskItems = taskItems || [];

    useEffect(() => {
        dispatch(taskThunks.listTasks({ taskListId: id, status: UNDONE_TASK }));
    }, []);

    const ui = {
        tasks: usableTaskItems.map((onetask:any) => <OneTask onSelect={() => onTaskSelected(onetask.id)} key={onetask.id} task={onetask} />),
    };

    const response = {
        handleEditName: async (taskName?:string) => {
            const finalName = taskName || '未命名分组';
            await dispatch(taskThunks.editTaskGroup(id, finalName));
            dispatch(taskThunks.listTaskGroup());
        },
    };

    return (
        <div className="mb40">

            <EffTaskGroupHeader onAdd={() => onAdd(id)} editName={response.handleEditName} editing={isNew} name={name} />

            <div className="mt20">
                {ui.tasks}
            </div>
        </div>
    );
}
