import React, { useEffect, useState } from 'react';
import './eff-tasks.less';
import { useDispatch, useSelector } from 'react-redux';
import { taskThunks } from '@slice/taskSlice';
import { Drawer } from 'antd';
import { tagThunks } from '@slice/tagSlice';
import { effToast } from '@components/common/eff-toast/eff-toast';
import { UNDONE_TASK } from '@config/sysConstant';
import TaskDetail from './task-detail';
import AddTaskForm from './add-task-form';
import { RootState } from '../../store/store';
import TaskGroup from './task-group';

export default function TaskContent() {
    const dispatch = useDispatch();
    const [activeGroupId, setActiveGroupId] = useState(-1); // 当前用于添加任务的分组ID
    const [showAddTaskFrom, setShowAddTaskForm] = useState(false); // 是否打开添加任务对话框
    const [showTaskDetail, setShowTaskDetail] = useState(false); // 是否显示任务详情
    const data = {
        groups: useSelector((state:RootState) => state.task.groups),
        tags: useSelector((state:RootState) => state.tag.tags),
    };

    useEffect(() => {
        dispatch(tagThunks.listTags());
    }, []);

    const response = {
        goAddTask: (id:number) => {
            setActiveGroupId(id);
            setShowAddTaskForm(true);
        },
        handleAddTask: async (task:any) => {
            setShowAddTaskForm(false);
            const deadline = task.deadline ? task.deadline.format('YYYY-MM-DD 00:00:00') : undefined;
            const payload = { taskListId: activeGroupId, ...task, deadline };
            await dispatch(taskThunks.addTask(payload));
            dispatch(taskThunks.listTasks({ taskListId: activeGroupId, status: UNDONE_TASK }));
        },
        handleCancelAdd: () => {
            setActiveGroupId(-1);
            setShowAddTaskForm(false);
        },
        handleTaskSelected: async (id:number) => {
            await dispatch(taskThunks.getTaskDetail(id));
            setShowTaskDetail(true);
        },
        handleDelTask: async (id:number, taskGroupId:number) => {
            const result:any = await dispatch(taskThunks.deleteTask(id));
            if (result as boolean) {
                effToast.success_withdraw('任务放入回收站成功', () => response.handleWithdrawDelTask(id, taskGroupId));
                dispatch(taskThunks.listTask(taskGroupId));
                setShowTaskDetail(false);
            }
        },
        handleWithdrawDelTask: async (id:number, taskGroupId:number) => {
            const result:any = await dispatch(taskThunks.withdrawDelTask(id));
            if (result as boolean) {
                effToast.success('撤销成功');
                dispatch(taskThunks.listTask(taskGroupId));
            }
        },
        taskUpdated: (taskId:number, taskGroupId: number) => {
            dispatch(taskThunks.getTaskDetail(taskId));
            dispatch(taskThunks.listTasks({ taskListId: taskGroupId, status: UNDONE_TASK }));
        },
    };

    const ui = {
        taskGroups: data.groups.map((item:any, index) => (
            <TaskGroup
                onTaskSelected={response.handleTaskSelected}
                onAdd={response.goAddTask}
                isNew={!item.name && index === data.groups.length - 1}
                id={item.id}
                name={item.name}
                key={item.id}
            />
        )),
    };

    return (
        <div className="eff-task-content">
            {ui.taskGroups}
            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                maskClosable={false}
                visible={showAddTaskFrom}
            >
                <AddTaskForm onConfirm={response.handleAddTask} onCancel={response.handleCancelAdd} tags={data.tags} />
            </Drawer>

            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                onClose={() => setShowTaskDetail(false)}
                visible={showTaskDetail}
            >
                <TaskDetail onDel={response.handleDelTask} onChange={response.taskUpdated} />
            </Drawer>
        </div>
    );
}
