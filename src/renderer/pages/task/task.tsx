import React, {useEffect, useState} from "react";
import EffSearchResult from "../../components/business/eff-search-result/eff-search-result";
import EffSearchArea from "../../components/business/eff-search-area/eff-search-area";
import EffButton from "../../components/eff-button/eff-button";
import {useDispatch, useSelector} from "react-redux";
import EffTaskContent from "./eff-task-content";
import {taskThunks} from "@slice/taskSlice";
import {RootState} from "../../store/store";
import {tagThunks} from "@slice/tagSlice";
import TaskAdvanceSearch from "./task-advance-search";
import {UserAddOutlined, FieldTimeOutlined} from '@ant-design/icons'


export default function Task(){
    const dispatch = useDispatch()
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)


    const data = {
        tags: useSelector((state:RootState)=>state.tag.tags),
        totalTasks: useSelector((state:RootState)=>state.task.totalTasks),
        searchMenus: [
            {key:'my-task', name:'我的任务', icon:<UserAddOutlined />},
            {key:'unstart', name:'未开始的任务', icon:<FieldTimeOutlined />},

        ],
        taskGroups: useSelector((state:RootState)=>state.task.groups)
    }
    useEffect(()=>{
        dispatch(taskThunks.listTaskGroup())
        dispatch(tagThunks.listTags())
    },[])

    const response = {
        handleAddNewTaskGroup:async ()=>{
            await dispatch(taskThunks.addTaskGroup())
            dispatch(taskThunks.listTaskGroup())

        },
        handleCancelAdvanceSearch: ()=>{
            setIsAdvanceSearch(false)
        },
        handleSearchMenu: (key:string)=>{
            switch (key){
                case 'my-task':
                    console.log('搜索我创建的')
                    break
                case 'unstart':
                    console.log('搜索未开始的')
                    break
                default:
                    setIsAdvanceSearch(true)
            }
        },
        handleAdvanceSearch: async (searchKeys:any)=>{
            for(const item of data.taskGroups){
                dispatch(taskThunks.listTask(item.id, searchKeys.name, searchKeys.handlerId, searchKeys.priority,searchKeys.tagIds))
            }
            setIsAdvanceSearch(false)
            setIsShowSearchResult(true)

        },
        handleSearch: async (name:string)=>{
            for(const item of data.taskGroups){
                dispatch(taskThunks.listTask(item.id, name))
            }
            setIsAdvanceSearch(false)
            setIsShowSearchResult(true)
        },
        handleClearSearchResult: ()=>{
            for(const item of data.taskGroups){
                dispatch(taskThunks.listTask(item.id))
            }
            setIsShowSearchResult(false)
        }

    }
    return (
        <div className="flex-grow-1 d-flex-column eff-tasks">
            <div style={{height:'40px'}} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={data.totalTasks} onClose={response.handleClearSearchResult}/>}
                {isAdvanceSearch? <TaskAdvanceSearch onSearch={response.handleAdvanceSearch} onCancel={response.handleCancelAdvanceSearch} tags={data.tags}/> :
                    <EffSearchArea onSearch={response.handleSearch} menuSelected={response.handleSearchMenu} menus={data.searchMenus}/>}
                <EffButton width={100} onClick={response.handleAddNewTaskGroup} type={"line"}  round={true} className="ml10 mr20" text={'+ 新增分组'} key={'add'}/>
            </div>
            <EffTaskContent/>
        </div>
    )
}
