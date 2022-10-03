import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import apiUrl from '@config/apiUrl';
import request from '../../utils/request';

/**
 * 添加任务参数DTO
 */
interface IAddTaskDto {
    taskListId: number;
    name: string;
    deadline?: Date;
    handlerId?: number;
    tagIds?: number[];
    priority?: string;
    description?: string;
    funztionId?: number;
}

interface ITaskDetailInfo {
    name: string;
    id: number;
    serial: number;
    taskListId: number;
    creatorDto: {
        name: string;
    };
    priority: string;
    status: string;
    deadline?: string;
    tagIds?: number[];
    description?: string;
    funztion?: {
        id: number;
        name: string;
    };
    handlerDto?: {
        id: number;
    };
}

interface ITaskGroup {
    id: number;
    name: string;
    [x: string]: any;
}

interface ITasks {
    [groupId: number]: {
        id: number;
        name: string;
    }[];
}

const taskSlice = createSlice({
    name: 'task',
    initialState: {
        groups: [] as ITaskGroup[],
        tasks: {} as ITasks,
        myTasks: [],
        totalTasks: 0,
        currentTask: {} as ITaskDetailInfo,
    },
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload;
        },
        setTasks: (state, action) => {
            const groupId = action.payload.taskGroupId;
            state.tasks[groupId] = action.payload.tasks;
            let total = 0;
            Object.keys(state.tasks).forEach((key: any) => {
                const num = state.tasks[key] ? state.tasks[key].length : 0;
                total += num;
            });
            state.totalTasks = total;
        },
        setCurrentTask: (state, action) => {
            state.currentTask = action.payload;
        },
        setMyTasks: (state, action) => {
            state.myTasks = action.payload;
        },
    },
});

const taskActions = taskSlice.actions;

const taskThunks = {
    // 重置store 数据
    resetStore: () => async (dispatch: Dispatch<any>) => {
        dispatch(taskActions.setGroups([]));
        dispatch(taskActions.setTasks({}));
    },
    listMyTasks: () => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.task.mine });
        if (result.isSuccess) {
            dispatch(taskActions.setMyTasks(result.data));
        }
    },

    listTaskGroup: () => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.taskList.index });
        if (result.isSuccess) {
            dispatch(taskSlice.actions.setGroups(result.data));
        }
    },
    addTaskGroup: (name?: string) => async () => {
        await request.post({ url: apiUrl.taskList.index, data: { name } });
    },
    editTaskGroup: (id: number, name?: string) => async () => {
        await request.put({ url: apiUrl.taskList.index, data: { id, name } });
    },
    addTask: (task: IAddTaskDto) => async () => {
        await request.post({ url: apiUrl.task.index, data: task });
    },
    // deprecated
    listTask: (taskGroupId: number, name?: string, handlerId?: number, priority?: string, tagIds?: string) => async (dispatch: Dispatch<any>) => {
        const result = await request.get({
            url: apiUrl.task.index,
            params: {
                size: 2000,
                taskListId: taskGroupId,
                key: name,
                handlerIds: handlerId,
                priorities: priority,
                tagIds,
            },
        });
        if (result.isSuccess) {
            const payload = {
                taskGroupId,
                tasks: result.data.data,
            };
            dispatch(taskActions.setTasks(payload));
        }
    },
    listTasks:
        (params: { taskListId: number; name?: string; handlerId?: number; priority?: string; tadIds?: number[]; status?: string[] }) =>
        async (dispatch: Dispatch<any>) => {
            const result = await request.get({ url: apiUrl.task.index, params });
            if (result.isSuccess) {
                const payload = {
                    taskGroupId: params.taskListId,
                    tasks: result.data.data,
                };
                dispatch(taskActions.setTasks(payload));
            }
        },
    markTaskDone: (id: number) => async () => {
        await request.put({ url: apiUrl.task.setDone, params: { id } });
    },
    markTaskUnDone: (params: { id: number }) => async () => {
        await request.put({ url: apiUrl.task.setUndone, params });
    },
    getTaskDetail: (id: number) => async (dispatch: Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.task.detail, params: { id } });
        if (result.isSuccess) {
            dispatch(taskActions.setCurrentTask(result.data));
        }
    },
    editTask:
        (data: {
            id: number;
            name?: string;
            handlerId?: number;
            priority?: string;
            deadline?: string;
            status?: string;
            tagIds?: number[];
            description?: string;
        }) =>
        async () => {
            await request.put({ url: apiUrl.task.index, data });
        },

    deleteTask: (id: number) => async () => {
        const result = await request.delete({ url: apiUrl.task.index, params: { id } });

        return result.isSuccess;
    },
    withdrawDelTask: (id: number) => async () => {
        const result = await request.put({ url: apiUrl.task.withdraw, params: { id } });
        return result.isSuccess;
    },
};

export { taskActions, taskThunks, ITaskDetailInfo, ITaskGroup, ITasks };

export default taskSlice.reducer;
