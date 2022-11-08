import React, { useState } from 'react';
import { Popover } from 'antd';
import {
    MoreOutlined,
} from '@ant-design/icons';
import ReqClassMenu from './req-class-menu'

interface IReqClassItemProps{
    id?:number,
    name:string,
    num:number,
    className?:string,
    isActive:boolean, // 是否为当前选中
    onClick:()=>void, // 响应点击事件,
    hasMenu?:boolean, // 是否有编辑菜单
}

export default function ReqClassItem(props:IReqClassItemProps) {
    const {
        name, num, className, id = -1, onClick, isActive, hasMenu = true,
    } = props;
    const [showMenuTrigger, setShowMenuTrigger] = useState(false); // 控制是否显示菜单触发器
    const [menuVisible, setMenuVisible] = useState(false); // 控制是否显示菜单
    const response = {
        handleMenuLave: () => {
            setShowMenuTrigger(false);
            setMenuVisible(false);
        },
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setShowMenuTrigger(true)}
            onMouseLeave={response.handleMenuLave}
            className={`req-class-item pr20 align-center d-flex justify-between ${className}`}
        >
            <div className={`border-red2 content d-flex justify-between ${isActive ? 'active' : ''}`}>
                <span className="clazz-name mr20">{name}</span>
                <span>{num}</span>
            </div>
            {hasMenu && id !== -1 && (
                <Popover
                    open={menuVisible}
                    className={`${showMenuTrigger ? 'show-menu' : 'hide-menu'}`}
                    content={<ReqClassMenu id={id} name={name} onMouseLeave={response.handleMenuLave} />}
                    placement="bottom"
                    trigger="click"
                >
                    <MoreOutlined
                        onClick={() => setMenuVisible(true)}
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                        }}
                    />
                </Popover>
            )}
        </div>
    );
}
