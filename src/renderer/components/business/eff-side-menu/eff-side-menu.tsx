import React from "react";
import {Layout} from "antd";
const {Sider} = Layout
import SideHeader from "./side-header";
import './eff-side-menu.less'
import MenuItem from "../menu/menu-item/menu-item";
import {HomeOutlined, UsergroupAddOutlined, CheckSquareOutlined, BugOutlined} from '@ant-design/icons'
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
            key: 'my-task',
            path:'/app/my-task'
        },
        {
            name:'我的Bug',
            icon: <BugOutlined style={{ fontSize: '16px', color: '#666666' }}/>,
            activeIcon: <BugOutlined style={{ fontSize: '16px', color:  Colors.mainYellowDark }}/>,
            key: 'my-bug',
            path:'/app/my-bug'
        },
        {
            name:'组织成员',
            icon: <UsergroupAddOutlined style={{ fontSize: '16px', color: '#666666' }}/>,
            activeIcon: <UsergroupAddOutlined style={{ fontSize: '16px', color:  Colors.mainYellowDark }}/>,
            key: 'org-member',
            path: '/app/org-member',
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
        return <MenuItem key={item.key}
                         onClick={()=>handleClick(item.key)}
                         className="mt20" name={item.name}
                         icon={item.icon} activeIcon={item.activeIcon} isActive={activeMenu==item.key}/>
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
