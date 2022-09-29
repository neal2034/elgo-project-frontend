import React from 'react';
import { Tag } from 'antd';
import { REQUIREMENT_STATUS } from '@config/sysConstant';
import './requirment.less';

interface IReqItemProps{
    showBg:boolean, // 是否显示background color
    id:number,
    name:string,
    version?:string,
    status:string,
    onChosen:(id:number)=>void
}

export default function RequirementItem(props:IReqItemProps) {
    const {
        showBg, id, name, version = '', status, onChosen,
    } = props;
    return (
        <div
            onClick={() => onChosen(id)}
            className={`one-requirement d-flex align-center pr20 justify-between pl20 ${showBg ? 'shadowed' : ''}`}
            key={id}
        >
            <div className="req-main">
                <span>{id}</span>
                <span className="ml20">{name}</span>
            </div>
            <div>
                <span className="version">{version}</span>
                <Tag className="ml10" color={REQUIREMENT_STATUS[status].color}>{REQUIREMENT_STATUS[status].name}</Tag>
            </div>
        </div>
    );
}
