import React, {useEffect, useState} from "react";
import './eff-menu.less'
import {projectMenus} from "@config/projectMenus";
import {useHistory, useRouteMatch} from "react-router";

interface IEffMenuItem{
    children?:JSX.Element | string
    value:string,
    handleClick?:(value:string)=>void,
    selectedKey?:string,
    [propNames:string]:any
}

interface IEffMenu{
    defaultSelectedKey?:string,
}


// 基础Menu组件
export default function EffMenu(props:IEffMenu){
    const {defaultSelectedKey} = props
    const [selectMenuKey, setSelectMenuKey] = useState<string>()
    const {url} = useRouteMatch()
    const history = useHistory()

    useEffect(()=>{setSelectMenuKey(defaultSelectedKey)},[defaultSelectedKey])
    const response = {
        menuSelected: (key:string)=>{
            let href = `${url}/${key}`;
            history.push(href)
            setSelectMenuKey(key)
        }
    }
    const ui = {
        menuItems : projectMenus.map((menu:any)=><EffMenuItem key={menu.key}
                                                              handleClick={response.menuSelected}
                                                              selectedKey={selectMenuKey} value={menu.key}>{menu.name}</EffMenuItem>)
    }

    return (
        <div className='eff-menu d-flex'>
            {ui.menuItems}
        </div>
    )
}


// 基础EffMenuItem 组件
function EffMenuItem(props:IEffMenuItem){
    const {value,children, handleClick, selectedKey} = props
    const isSelected = (selectedKey == value)
    const response = {
        onClick: ()=>{
            if(handleClick){
                handleClick(value)
            }
        }
    }

    return (
        <div className={`mr40 eff-menu-item ${isSelected?'eff-menu-item-selected':''}`} onClick={response.onClick}>
            <div className="mb10">
                {children}
            </div>
        </div>
    )
}

export {EffMenuItem}
