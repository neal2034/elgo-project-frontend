import React from 'react';

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

function MenuItem(props:IMenuItemProps) {
    const { onChosen, name, isActive } = props;
    return (
        <div onClick={onChosen} className={`align-center d-flex justify-center setting-menu-item ${isActive ? 'setting-menu-item-active' : ''}`}>
            {name}
        </div>
    );
}

export default function SettingMenus(props:IProps) {
    const { menus } = props;
    return (
        <div className="setting-menus">
            <div className="ml20 mt20 mb20 d-flex justify-between">
                <span className="title">项目设置</span>
            </div>
            <div>
                {menus.map((item:any) => (
                    <MenuItem
                        isActive={props.activeKey === item.key}
                        onChosen={() => props.menuSelected(item.key)}
                        key={item.key}
                        name={item.name}
                    />
                ))}
            </div>
        </div>
    );
}
