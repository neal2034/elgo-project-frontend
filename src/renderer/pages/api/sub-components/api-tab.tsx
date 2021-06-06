/**
 * 组件： 用于描述API Tab
 */
import React, {useState} from "react";
import {API} from "@slice/apiSlice";
import {CloseOutlined} from '@ant-design/icons'
import './api-wrapper.less'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {setCurrentApiSerial} from '@slice/apiSlice'

interface ApiProps{
    api:API
}


export default function ApiTab(props:ApiProps){
    const {name, method, isExample, dirty,serial} = props.api
    const dispatch = useDispatch()

    const currentApiSerial = useSelector((state:RootState)=>state.api.currentApiSerial)
    const isActive = currentApiSerial === serial


    const methodColorClass = () => {
        let name = method === 'DELETE' ? 'DEL' : method;
        name = name.toLowerCase();
        return name + "-method";
    }


    const handler = {
        handleTabClick:()=>{
            dispatch(setCurrentApiSerial(serial))
        }
    }

    return (
        <div onClick={handler.handleTabClick} className={`api-tab  ${isActive?'active-tab':''} `}>
            <div className="d-flex align-center">
                {isExample? <div className="example mr5">例</div>:<span className={'method '+methodColorClass()}>{method.toUpperCase()}</span>}
                <span>{name}</span>
            </div>
            <div className="d-flex">
                {dirty?<div className="dirty"/>:null}
                <CloseOutlined className="btn-close" />
            </div>
        </div>
    )
}
