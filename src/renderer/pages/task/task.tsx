import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { taskThunks } from '@slice/taskSlice';
import { tagThunks } from '@slice/tagSlice';
import { UserAddOutlined, FieldTimeOutlined } from '@ant-design/icons';
import EffSearchResult from '../../components/business/eff-search-result/eff-search-result';
import EffSearchArea from '../../components/business/eff-search-area/eff-search-area';
import EffButton from '../../components/eff-button/eff-button';
import TaskContent from './task-content';
import { RootState } from '../../store/store';
import TaskAdvanceSearch from './task-advance-search';

export default function Task() {
    const dispatch = useDispatch();
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);

    const data = {
        tags: useSelector((state:RootState) => state.tag.tags),
        totalTasks: useSelector((state:RootState) => state.task.totalTasks),
        searchMenus: [
            { key: 'my-task', name: '我的任务', icon: <UserAddOutlined /> },
            { key: 'unstart', name: '未开始的任务', icon: <FieldTimeOutlined /> },

        ],
        taskGroups: useSelector((state:RootState) => state.task.groups),
    };
    useEffect(() => {
        dispatch(taskThunks.listTaskGroup());
        dispatch(tagThunks.listTags());
    }, []);

    const response = {
        handleAddNewTaskGroup: async () => {
            await dispatch(taskThunks.addTaskGroup());
            dispatch(taskThunks.listTaskGroup());
        },
        handleCancelAdvanceSearch: () => {
            setIsAdvanceSearch(false);
        },
        handleSearchMenu: (key:string) => {
            switch (key) {
            case 'my-task':
                // TODO fulfill this
                break;
            case 'unstart':
                // TODO fulfill this
                break;
            default:
                setIsAdvanceSearch(true);
            }
        },
        handleAdvanceSearch: async (searchKeys:any) => {
            data.taskGroups.forEach((item) => {
                dispatch(taskThunks.listTask(item.id, searchKeys.name, searchKeys.handlerId, searchKeys.priority, searchKeys.tagIds));
            });
            setIsAdvanceSearch(false);
            setIsShowSearchResult(true);
        },
        handleSearch: async (name:string) => {
            data.taskGroups.forEach((item) => {
                dispatch(taskThunks.listTask(item.id, name));
            });
            setIsAdvanceSearch(false);
            setIsShowSearchResult(true);
        },
        handleClearSearchResult: () => {
            data.taskGroups.forEach((item) => {
                dispatch(taskThunks.listTask(item.id));
            });
            setIsShowSearchResult(false);
        },

    };
    return (
        <div className="flex-grow-1 d-flex-column eff-tasks">
            <div style={{ height: '40px' }} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch && <EffSearchResult value={data.totalTasks} onClose={response.handleClearSearchResult} />}
                {isAdvanceSearch
                    ? <TaskAdvanceSearch onSearch={response.handleAdvanceSearch} onCancel={response.handleCancelAdvanceSearch} tags={data.tags} />
                    : <EffSearchArea onSearch={response.handleSearch} menuSelected={response.handleSearchMenu} menus={data.searchMenus} />}
                <EffButton width={100} onClick={response.handleAddNewTaskGroup} type="line" round className="ml10 mr20" text="+ 新增分组" key="add" />
            </div>
            <TaskContent />
        </div>
    );
}
