import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EffInfoSep from '@components/business/eff-info-sep/eff-info-sep';
import { taskThunks } from '@slice/taskSlice';
import { Drawer } from 'antd';
import { effToast } from '@components/common/eff-toast/eff-toast';
import { projectActions } from '@slice/projectSlice';
import ImgSmile from '@imgs/smile.png';
import TaskDetail from '../task/task-detail';
import OneTask from '../task/one-task';
import { RootState } from '../../store/store';
import './my-task.less';

interface IGroupTasks{
    id:number,
    taskListName:string,
    tasks:[]
}

interface IProjectTasks{
    projectId:number,
    projectName:string,
    members:[],
    taskList:IGroupTasks[]
}

interface IPropProjectTasks{
    item:IProjectTasks,
    onTaskSelected:(id:number)=>void,
}

function MyProjectTask(props:IPropProjectTasks) {
    const dispatch = useDispatch();
    const { item } = props;
    const [tasks, setTasks] = useState([]);

    const response = {
        handleSelected: (id:number) => {
            dispatch(projectActions.setProjectMembers(item.members));
            props.onTaskSelected(id);
        },
    };

    useEffect(() => {
        const tempTasks:any = [];
        item.taskList.forEach((listItem) => {
            listItem.tasks.forEach((onItem) => {
                tempTasks.push(onItem);
            });
        });
        setTasks(tempTasks);
    }, [item]);

    const taskItems = tasks.map((taskItem:any) => (
        <OneTask
            key={taskItem.id}
            task={taskItem}
            onSelect={() => response.handleSelected(taskItem.id)}
        />
    ));

    return (
        <>
            <EffInfoSep className="ml40 mt40" name={item.projectName} />
            {taskItems}
        </>
    );
}

export default function MyTask() {
    const dispatch = useDispatch();
    const myTasks = useSelector((state:RootState) => state.task.myTasks);
    const [showTaskDetail, setShowTaskDetail] = useState(false); // 是否显示任务详情
    useEffect(() => {
        dispatch(taskThunks.listMyTasks());
    }, []);

    const response = {
        handleDelTask: async (id:number) => {
            const result:any = await dispatch(taskThunks.deleteTask(id));
            if (result as boolean) {
                effToast.success_withdraw('任务放入回收站成功', () => response.handleWithdrawDelTask(id));
                dispatch(taskThunks.listMyTasks());
                setShowTaskDetail(false);
            }
        },
        handleWithdrawDelTask: async (id:number) => {
            const result:any = await dispatch(taskThunks.withdrawDelTask(id));
            if (result as boolean) {
                effToast.success('撤销成功');
                dispatch(taskThunks.listMyTasks());
            }
        },
        handleTaskSelected: async (id:number) => {
            await dispatch(taskThunks.getTaskDetail(id));
            setShowTaskDetail(true);
        },
        taskUpdated: (taskId:number, taskGroupId: number) => {
            dispatch(taskThunks.getTaskDetail(taskId));
            dispatch(taskThunks.listMyTasks());
        },
    };

    const taskList = myTasks.map((item:any) => <MyProjectTask onTaskSelected={response.handleTaskSelected} key={item.projectId} item={item} />);

    return (
        <div className="my-tasks">
            {myTasks.length === 0 ? (
                <div className=" empty-task d-flex-column align-center justify-center">
                    <img alt="empty" src={ImgSmile} width={80} />
                    <span className="mt20 desc">太棒了,没有需要完成的任务哦</span>
                </div>
            ) : taskList}
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
