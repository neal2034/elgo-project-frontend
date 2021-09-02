import React, {useEffect} from "react";
import {setBreadcrumbs} from "../../store/breadcrumbSlice";
import {useDispatch} from "react-redux";



export default function MyTask(){
    const dispatch = useDispatch()
    useEffect(()=>{dispatch(setBreadcrumbs(['我的任务']))}, [dispatch])
    return (
        <div>
            我的任务
        </div>
    )
}
