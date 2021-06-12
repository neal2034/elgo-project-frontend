/**
 * 组件： 用于描述内容区Tab 区域
 */
import React, {useEffect, useRef, useState} from "react";
import "./api-wrapper.less"
import {PlusOutlined} from '@ant-design/icons'
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {useDispatch} from "react-redux";
import { API, apiActions} from '@slice/apiSlice'
import ApiTab from "./api-tab";


interface IApiTabsProps{
    maxContentWidth:number
}

export default function ApiTabs(props:IApiTabsProps){
    const {maxContentWidth} = props;
    const dispatch = useDispatch()
    let activeApis = useSelector((state:RootState) => state.api.activeApis)
    const activeTabs = activeApis.map(item=>{
        return <ApiTab api={item} key={item.serial}/>
    })

    const handleAddActiveApi = ()=>{
        dispatch(apiActions.addActiveApi())
    }
    return (
        <div   className="tabs d-flex" style={{maxWidth:maxContentWidth+'px'}}>
            <div className="tab-wrapper">
                {activeTabs}
            </div>

            <div onClick={handleAddActiveApi} className="btn-add d-flex justify-center align-center cursor-pointer">
                <PlusOutlined />
            </div>
        </div>
    )
}
