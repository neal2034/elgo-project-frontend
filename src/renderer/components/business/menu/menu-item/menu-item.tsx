import React, { ReactElement, useState } from 'react';
import './menu-item.less';

interface IMenuItemProps{
    name:string,
    icon:ReactElement,
    activeIcon:ReactElement,
    isActive:boolean,
    className?:string,
    [propName:string]:any,
}

export default function MenuItem(props: IMenuItemProps) {
    const {
        name, icon, isActive, activeIcon, className, ...rest
    } = props;
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={`"d-flex elgo-menu-item align-center cursor-pointer ${className}`}
            {...rest}
        >
            {isActive || isHover ? activeIcon : icon}
            <span className={`ml5 ${isActive ? 'active' : ''}`}>{name}</span>
        </div>
    );
}
