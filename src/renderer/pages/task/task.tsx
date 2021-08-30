import React, {useEffect, useState} from "react";
import EffSearchResult from "../../components/business/eff-search-result/eff-search-result";
import FunztionAdvanceSearch from "../funztion/funztion-advance-search";
import EffSearchArea from "../../components/business/eff-search-area/eff-search-area";
import EffButton from "../../components/eff-button/eff-button";
import {useDispatch} from "react-redux";
import EffTaskContent from "./eff-task-content";
import EffTaskGroupHeader from "./eff-task-group-head";
import {taskThunks} from "@slice/taskSlice";


export default function Task(){
    const dispatch = useDispatch()
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const [isOpenAddForm, setIsOpenAddForm] = useState(false)

    useEffect(()=>{
        dispatch(taskThunks.listTaskGroup())
    },[])

    const response = {
        occupy :()=>{},
        handleAddNewTaskGroup:async ()=>{
            await dispatch(taskThunks.addTaskGroup())
            dispatch(taskThunks.listTaskGroup())

        }

    }
    return (
        <div className="flex-grow-1 d-flex-column eff-tasks">
            <div style={{height:'40px'}} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={22} onClose={response.occupy}/>}
                {isAdvanceSearch? <FunztionAdvanceSearch onSearch={response.occupy} onCancel={response.occupy} tags={[]}/> :
                    <EffSearchArea onSearch={response.occupy} menuSelected={response.occupy} menus={[]}/>}
                <EffButton width={100} onClick={response.handleAddNewTaskGroup} type={"line"}  round={true} className="ml10 mr20" text={'+ 新增分组'} key={'add'}/>
            </div>
            <EffTaskContent/>
        </div>
    )
}
