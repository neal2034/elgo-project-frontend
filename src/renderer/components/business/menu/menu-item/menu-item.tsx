import React, {ReactElement} from "react";
import './menu-item.less'

interface IMenuItemProps{
    name:string,
    icon:ReactElement,
    activeIcon:ReactElement,
    isActive:boolean,
    className?:string,
    [propName:string]:any,
}


export default function MenuItem(props: IMenuItemProps){
    const {name, icon, isActive, activeIcon, className, ...rest} = props

    return (
        <div className={`"d-flex align-center cursor-pointer ${className}`} {...rest}  >
            {isActive? activeIcon:icon}
            <span className={`ml5 ${isActive?'active':''}`}>{name}</span>
        </div>
    )

}
