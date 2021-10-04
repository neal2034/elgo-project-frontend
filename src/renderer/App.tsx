import React, {useEffect, useState} from "react";
import {Dropdown, Layout, Menu} from "antd";
import PrivateRoute from "@components/common/private-route/private-route";
import ProjectHome from "./pages/project-home/project-home";
import {Switch} from "react-router-dom";
import EffSideMenu from "./components/business/eff-side-menu/eff-side-menu";
import Api from "./pages/api/api";
import OrgSwitch from "./pages/orgnazation-switch/org-switch";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/store";
import EffBreadCrumb from "./components/eff-breadcrumb/eff-breadcrumb";
import ProjectCenter from "./pages/project-center/project-center";
import EffUser from "@components/eff-user/eff-user"
import './assets/css/app.less'
import {useHistory} from "react-router";
import {accountThunks} from "@slice/accountSlice";
import MyTask from "./pages/my-task/my-task";
import MyBugs from "./pages/my-bugs/my-bugs";
import OrgMembers from "./pages/org-members/org-members";
import {imgSwitch, imgQuit, imgProfile} from "@config/svgImg";

const {Content} = Layout



const App = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const breads = useSelector((state:RootState)=>state.breadcrumb.breadcrumbs)
    const currentMember:any = useSelector((state:RootState)=>state.account.currentMember)
    useEffect(()=>{dispatch(accountThunks.getCurrentMember())},[dispatch])

    const response = {

        dropdownMenuSelected: ({key,domEvent}:{key:any,domEvent:any})=>{
            domEvent.stopPropagation()

            switch (key){
                case 'switch-org':
                    history.push("/app/org-switch")
                    break;
                case 'change-pwd':
                    alert('修改密码功能开发中')
                    break;
                case 'log-out':
                    history.push("/login")
                    break;
            }
        },

    }

    const menu = (
        <Menu  onClick={response.dropdownMenuSelected} className="user-menu">
            <Menu.Item className="menu-item" key={"switch-org"}>
                <span>{imgSwitch} 切换组织</span>
            </Menu.Item>
            <Menu.Item className="menu-item" key={"change-pwd"}>
                  <span>{imgProfile} 个人设置</span>
            </Menu.Item>
            <Menu.Item className="menu-item" key={"log-out"}>
                <span>{imgQuit} 退出登录</span>
            </Menu.Item>

        </Menu>
    );

    return (
         <Layout className="app_layout">
             <EffSideMenu/>
             <Content className="app_content">
                     <EffBreadCrumb breads={breads}/>
                     <Dropdown   overlay={menu}  trigger={['click']} placement="bottomRight" >
                         <EffUser   id={currentMember.id} name={currentMember.name} size={24} className="current-user cursor-pointer"/>
                     </Dropdown>
                     <Switch>
                         <PrivateRoute component={OrgSwitch} path="/app/org-switch" />
                         <PrivateRoute component={Api} path="/app/api" />
                         <PrivateRoute component={ProjectCenter} path={'/app/project-center'}/>
                         <PrivateRoute component={MyTask} path={'/app/my-task'}/>
                         <PrivateRoute component={MyBugs} path={'/app/my-bug'}/>
                         <PrivateRoute component={OrgMembers} path={'/app/org-member'}/>
                         <PrivateRoute component={ProjectHome} path='/app/project/:serial'/>

                     </Switch>
                 </Content>
         </Layout>
    )
}


export default App;
