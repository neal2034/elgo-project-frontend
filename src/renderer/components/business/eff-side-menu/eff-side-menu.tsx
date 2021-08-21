import React from "react";
import {Layout} from "antd";
const {Sider} = Layout
import SideHeader from "./side-header";
import './eff-side-menu.less'
import MenuItem from "../menu/menu-item/menu-item";
import {HomeOutlined, MessageOutlined, CheckSquareOutlined} from '@ant-design/icons'
import Colors from '@config/globalColor';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {menuActions} from "@slice/menuSlice";
import {useHistory} from "react-router";

export default function EffSideMenu (){
    const dispatch = useDispatch();
    const history = useHistory();
    const activeMenu = useSelector((state:RootState) => state.menu.activeMenu)

    const mainMenus = [
        {
            name:'项目中心',
            icon: <HomeOutlined style={{ fontSize: '16px', color: '#666666' }}/>,
            activeIcon: <HomeOutlined style={{ fontSize: '16px', color:  Colors.mainYellowDark }}/>,
            key: 'home',
            path:'/app/project-center'
        },
        {
            name:'我的任务',
            icon: <CheckSquareOutlined style={{ fontSize: '16px', color: '#666666' }}/>,
            activeIcon: <CheckSquareOutlined style={{ fontSize: '16px', color:  Colors.mainYellowDark }}/>,
            key: 'my-task'
        },
        {
            name:'我的消息',
            icon: <MessageOutlined style={{ fontSize: '16px', color: '#666666' }}/>,
            activeIcon: <MessageOutlined style={{ fontSize: '16px', color:  Colors.mainYellowDark }}/>,
            key: 'my-message'
        },

    ]

    const  handleClick = (key:string)=>{
        dispatch(menuActions.setActiveMenu(key))
        mainMenus.forEach(item=>{
            if(item.key==key && item.path){
                history.push(item.path)
            }
        })
    }

    const mainMenuItems = mainMenus.map(item=>{
        return <MenuItem key={item.key} onClick={()=>handleClick(item.key)} className="mt20" name={item.name} icon={item.icon} activeIcon={item.activeIcon} isActive={activeMenu==item.key}/>
    })

    return (
        <Sider width="180" className="side-menu">
            <SideHeader />
            <div className="mt40 menus">
                {mainMenuItems}
            </div>
        </Sider>
    )

}
