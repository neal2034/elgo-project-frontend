import React from "react";
import {Tag} from "antd";
import './funztion.less'

interface IProps{
    showBg:boolean,     //是否显示background color
    id:number,
    serial:number,
    name:string,
    statusId:number,
    status:any[],
    onChosen:(id:number)=>void
}

export default function FunztionItem(props:IProps){
    const {showBg, id, serial, name, statusId, onChosen,status} = props
    let theStatus:{name:string, color:string} = status.filter((item:any)=>item.id === statusId)[0]
    return (
        <div onClick={()=>onChosen(id)} className={`one-funztion d-flex align-center pr20 justify-between pl20 ${showBg?'shadowed':''}`} key={id}>
            <div className="funz-main">
                <span>{serial}</span>
                <span className="ml20">{name}</span>
            </div>
            <div>
                <Tag className="ml10" color={theStatus && theStatus.color}>{theStatus && theStatus.name}</Tag>
            </div>
        </div>
    )
}
