import React from "react";
import EffUser from "@components/eff-user/effUser";
import './eff-member-item.less'


interface IMember{
    id:number,
    email:string,
    name:string,
    boolEnable:boolean,
    boolOwner?:boolean,
    boolProjectOwner?:boolean,
}

interface IProps{
    member:IMember,
    onDel:Function,
}

export default function EffMemberItem(props:IProps){
    const {member} = props
    let title = member.boolProjectOwner?'项目拥有者':''
    title = member.boolOwner?'超级管理员':title

    return <div className="d-flex member-item  mb40">
        <div className="mr5 title">{title}</div>
        <div className="d-flex justify-between flex-grow-1 align-center">
            <div className="d-flex align-center">
                <EffUser id={member.id} name={member.name} size={35}/>
                <div className="d-flex-column ml10 detail">
                    <span className="name mb5">{member.name}</span>
                    <div className="d-flex align-end justify-between">
                        <span className="email">{member.email} </span>
                        { member.boolEnable || <span className="sleep">未激活</span>}
                    </div>
                </div>
            </div>
            <span onClick={()=>props.onDel()} className="ml20 remove">移除</span>
        </div>

    </div>

}
