import React from "react";
import './bug.less'
import {BUG_SEVERITY, BUG_STATUS} from "@config/sysConstant";
import EffStatus from "@components/business/eff-status/eff-status";
import EffUser from "@components/eff-user/eff-user";



interface IBugItem{
    id:number,
    serial:number,
    name:string,
    status:'NEW'|'OPEN'|'REJECT'|'ASSIGNED'|'FIXED'|'VERIFIED'|"WORK_AS_DESIGN"|'CAN_NOT_REPRODUCE',
    handler?:string,
    handlerId?:number,
    severity:'CRASH'|'SERIOUS'|'NORMAL'|'HINT'|'ADVICE',
    [x:string]:any
}


interface IProps{
    showBg:boolean,     //是否显示background color
    bug:IBugItem,
    onChosen:(id:number)=>void
}

export default function BugItem(props:IProps){
    const {bug, onChosen,showBg} = props
    const bugStatusName = BUG_STATUS[bug.status].name
    const bugStatusColor = BUG_STATUS[bug.status].color
    const severityName = BUG_SEVERITY[bug.severity].name
    const severityColor = BUG_SEVERITY[bug.severity].color


    return (
        <div onClick={()=>onChosen(bug.id)} className={`one-bug d-flex align-center pr20 justify-between pl20 ${showBg?'shadowed':''}`} key={bug.id}>
            <div className="bug-main">
                <span>{bug.serial}</span>
                <span className="ml20">{bug.name}</span>
            </div>
            <div className="d-flex">
                {bug.handler && bug.handlerId && <EffUser id={bug.handlerId} name={bug.handler} size={20} />}
                <EffStatus className="ml20" name={severityName} color={severityColor}/>
                <EffStatus className="ml20" name={bugStatusName} color={bugStatusColor}/>
            </div>
        </div>
    )

}
