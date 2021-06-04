/**
 * 组件： 用于描述API Tab
 */
import React from "react";
import {API} from "@slice/apiSlice";

interface ApiProps{
    api:API
}


export default function ApiTab(props:ApiProps){
    const {name, method, isExample} = props.api
    const methodColorClass = () => {
        let name = method === 'DELETE' ? 'DEL' : method;
        name = name.toLowerCase();
        return name + "-method";
    }

    return (
        <div className="api-tab">
            <div className="d-flex align-center">
                {isExample? <div className="example mr5">例</div>:<span className={'method '+methodColorClass()}>{method}</span>}
                <span>{name}</span>
            </div>
        </div>
    )
}
