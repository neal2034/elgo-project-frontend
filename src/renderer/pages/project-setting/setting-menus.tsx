import React from "react";


interface IProps{

    menuSelected:(key:string)=>void,
    menus:any,
    activeKey:string,
}

interface IMenuItemProps{
    name:string,
    onChosen:()=>void,
    isActive:boolean,
}

export default function SettingMenus(props:IProps){


    return (
        <div className="setting-menus">
            <div className="ml20 mt20 mb20 d-flex justify-between">
                <span className="title">项目设置</span>
            </div>
            <div>
                {props.menus.map((item:any)=><MenuItem isActive={props.activeKey==item.key} onChosen={()=>props.menuSelected(item.key)} key={item.key} name={item.name}/>)}
            </div>
        </div>
    )
}



function MenuItem(props:IMenuItemProps){

    return <div onClick={props.onChosen} className={`align-center d-flex justify-center setting-menu-item ${props.isActive? 'setting-menu-item-active':''}`}>
        {props.name}
    </div>
}
