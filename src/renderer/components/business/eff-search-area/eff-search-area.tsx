import React, {ReactNode, useEffect, useState} from "react";
import {Input, Popover} from "antd";
import './eff-search-area.less'
import {SearchOutlined, FilterOutlined} from '@ant-design/icons'


/**
 * 该组件用于表达搜索输入框以及搜索后的结果
 * @constructor
 */

interface IMenuItem{
    key:string,
    name:string,
    icon?:ReactNode,
    advance?:boolean
}

interface IProps{
    menus:IMenuItem[],
    menuSelected:(key:string)=>void,        //按指定的菜单搜索
    onSearch:(value:string)=>void,          //按关键字搜索
}

export default function EffSearchArea(props:IProps){
    const {menus, menuSelected,onSearch}= props
    const [searchWidth, setSearchWidth] = useState('150px')
    const [showMenu, setShowMenu] = useState(false)
    const [searchValues, setSearchValues] = useState<string>()

    const clickOutSideSearchArea = (e:any)=>{
        if(!e.target.matches(".menu-item") && !e.target.matches('.ant-input')){
            setSearchWidth('150px')
            setShowMenu(false)
        }
    }

    useEffect(()=>{
        document.addEventListener('mouseup',  clickOutSideSearchArea)
        return ()=>{
            document.removeEventListener('mouseup', clickOutSideSearchArea)
        }
    },[])




    const finalMenus = menus.concat([{key:'eff-advance-menu', advance:true,  name:'高级搜索',icon:<FilterOutlined/>}])
    const response = {
        inputFocus: ()=>{
            setSearchWidth('300px')
            setShowMenu(true)
        },
        onMenuItemSelect: (key:string)=>{
            if(key=='eff-search-text'){
                onSearch(searchValues!)
            }else{
                menuSelected(key)
            }
            setSearchWidth('150px')
            setShowMenu(false)

        },
        handleInputChange: (e:any)=>{
            setSearchValues(e.target.value)
        },

    }
    const ui = {
        menuItems: finalMenus.map(item=><MenuItem key={item.key} menuKey={item.key} isAdvance={item.advance} name={item.name} icon={item.icon}/>),
        popMenu: <div className="eff-search-area-menu" style={{width:'300px'}}>
            {searchValues && <MenuItem onSelect={response.onMenuItemSelect} menuKey={'eff-search-text'} name={`搜索关键字 ${searchValues}`} icon={<SearchOutlined/>} />}
            {finalMenus.map(item=><MenuItem key={item.key} onSelect={response.onMenuItemSelect} menuKey={item.key} isAdvance={item.advance} name={item.name} icon={item.icon}/>)}
        </div>,

    }




    return <div className="eff-search-area" style={{width:searchWidth}}>
        <Popover visible={showMenu}  placement="bottomRight" content={ui.popMenu} trigger={'click'}>
            <Input
                onChange={response.handleInputChange}
                prefix={<SearchOutlined style={{fontSize:'14px'}} />}
                onFocus={response.inputFocus}  />
        </Popover>


    </div>
}


/**
 * 表单菜单项
 * @param props
 * @constructor
 */
function MenuItem(props:any){
    const { menuKey, name, icon, isAdvance=false, onSelect} = props
    const response = {
        menuSelected: ()=>{
            onSelect(menuKey)
        }
    }
    return <div onClick={response.menuSelected} className={`menu-item ${isAdvance?'advance-menu':''}`}>
        {icon} <span className="ml10">{name}</span>
    </div>
}
