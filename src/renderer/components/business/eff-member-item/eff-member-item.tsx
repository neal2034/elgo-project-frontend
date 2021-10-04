import React from "react";
import EffUser from "@components/eff-user/eff-user";
import './eff-member-item.less'
import {Checkbox} from "antd";


interface IMember{
    id:number,
    email:string,
    name:string,
    userId:number,
    avatar?:string,
    boolEnable:boolean,
    boolOwner?:boolean,
    boolProjectOwner?:boolean,

}

interface IProps{
    member:IMember,
    onDel?:()=>void,
    onSelect?:(value:boolean)=>void,
    select?:boolean,
    className?:string
}

export default function EffMemberItem(props:IProps){
    const {member} = props
    let title = member.boolProjectOwner?'项目拥有者':''
    title = member.boolOwner?'超级管理员':title
    const width = props.select? '260px':'380px';

    const response = {
        handleDel(){
            if(props.onDel){
                props.onDel()
            }
        },
        handleSelect(e:any){
            if(props.onSelect){
                props.onSelect(e.target.checked)
            }
        }
    }

    return <div style={{width}} className={`d-flex align-center member-item  mb40 ${props.className}`}>
        {props.select || <div className="mr5 title">{title}</div>}
        {props.select && <Checkbox onChange={response.handleSelect} className="mr20"/>}
        <div className="d-flex justify-between flex-grow-1 align-center">
            <div className="d-flex align-center">
                <EffUser img={member.avatar} id={member.userId} name={member.name} size={35}/>
                <div className="d-flex-column ml10 detail">
                    <span className="name mb5">{member.name}</span>
                    <div className="d-flex align-end justify-between">
                        <span className="email">{member.email} </span>
                        { props.select || member.boolEnable || <span className="sleep">未激活</span>}
                    </div>
                </div>
            </div>
            {props.select || <span onClick={response.handleDel} className="ml20 remove">移除</span>}
        </div>

    </div>

}
