import React, {useEffect} from "react";
import './api.less'
import {useDispatch} from "react-redux";
import {setBreadcrumbs} from '../../store/breadcrumbSlice'
import ApiSideBar from "./sub-components/api-sidebar";


export default function Api(){

    const dispatch = useDispatch();

    //设置面包屑
    useEffect(()=>{dispatch(setBreadcrumbs(['接口管理']))}, [dispatch])

    return (
        <div className="api d-flex">
            <ApiSideBar></ApiSideBar>
            {/*<div className="api-tree"></div>*/}
            <div className="api-content ml10"></div>
        </div>
    )
}
