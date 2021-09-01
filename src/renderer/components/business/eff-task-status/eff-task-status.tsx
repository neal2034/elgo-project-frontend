import React from "react";
import {TASK_STATUS} from "@config/sysConstant";

interface IProps{

    value:string,
    className?:string,
}
export default function EffTaskStatus(props:IProps){
    const {value,className} = props
    const name = TASK_STATUS[value].name
    const color = TASK_STATUS[value].color
    return (
        <div style={{
            border: '1px solid ' + color,
            padding: '3px',
            fontSize:'12px',
            height: '20px',
            color: color,
        }} className={`d-flex justify-center align-center ${className}`}>
            {name}
        </div>
    )
}
