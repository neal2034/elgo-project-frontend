import React from 'react';
import { Tag } from 'antd';
import './funztion.less';
import {FUNZTION_STATUS, REQUIREMENT_STATUS} from "@config/sysConstant";

interface IProps{
    showBg:boolean, // 是否显示background color
    id:number,
    name:string,
    status:string,
    onChosen:(id:number)=>void
}

export default function FunztionItem(props:IProps) {
    const {
        showBg, id, name, status, onChosen,
    } = props;
    return (
        <div
            onClick={() => onChosen(id)}
            className={`one-funztion d-flex align-center pr20 justify-between pl20 ${showBg ? 'shadowed' : ''}`}
            key={id}
        >
            <div className="funz-main">
                <span>{id}</span>
                <span className="ml20">{name}</span>
            </div>
            <div>
                <Tag className="ml10" color={FUNZTION_STATUS[status].color}>{FUNZTION_STATUS[status].name}</Tag>

            </div>
        </div>
    );
}
