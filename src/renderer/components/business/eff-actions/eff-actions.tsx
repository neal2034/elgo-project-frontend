import React, {ReactNode, useState} from "react";
import globalColor from "@config/globalColor";
import {EllipsisOutlined} from '@ant-design/icons'
import {Dropdown, Menu} from "antd";


interface IMenus{
    key:string,
    name:string,
    icon?:ReactNode
}

interface IProps{
    width?:string,      //按钮大小 默认20px
    className?:string,
    menus:IMenus[],
    onSelect:(key:string)=>void,    //点击响应事件

}


//该组件用于表示详情页面当中的操作菜单
export default function EffActions(props:IProps){
    const {width='20px', className, menus, onSelect} = props
    const [showMenus, setShowMenus] = useState(false)
    const style = {
        action:{
            width:width,
            height:width,
            borderRadius:'50%',
            border: '1px solid ' + globalColor.fontWeak
        },
        icon:{
            fontSize:'20px',
            color:globalColor.fontWeak
        }
    }

    const response = {
        openMenu:()=>setShowMenus(true),
        dropdownMenuSelected:({key,domEvent}:{key:string, domEvent:any})=>{
            domEvent.stopPropagation()
            setShowMenus(false)
            onSelect(key)
        }
    }

    const ui = {
        actionItems: <Menu onClick={response.dropdownMenuSelected}   className="pl20 pr20 pt20 pb20">
            {menus.map(item=><Menu.Item key={item.key} icon={item.icon}>
                <span>{item.name}</span>
            </Menu.Item>)}
        </Menu>
    }





    return <Dropdown  overlayStyle={{width:'200px'}} overlay={ui.actionItems} visible={showMenus}  placement="bottomRight" >
        <div onClick={response.openMenu} style={style.action} className={`d-flex justify-center align-center cursor-pointer ${className}`}>
            <EllipsisOutlined style={style.icon} />
        </div>
    </Dropdown>

}
