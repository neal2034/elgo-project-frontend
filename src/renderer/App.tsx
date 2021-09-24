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
const {Content} = Layout



const App = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const breads = useSelector((state:RootState)=>state.breadcrumb.breadcrumbs)
    const currentMember:any = useSelector((state:RootState)=>state.account.currentMember)
    useEffect(()=>{dispatch(accountThunks.getCurrentMember())},[dispatch])
     
    const [orgMenuVisible, setOrgMenuVisible] = useState(false);
    const response = {
        userClick: ()=>{
           setOrgMenuVisible(true)
        },
        dropdownMenuSelected: ({key,domEvent}:{key:any,domEvent:any})=>{
            domEvent.stopPropagation()
            setOrgMenuVisible(false)
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
        openDropdownMenu: (event:any)=>{
            event.stopPropagation();
            setOrgMenuVisible(true);
        }
    }
    const menu = (
        <Menu  onClick={response.dropdownMenuSelected} className="drop-down-menu-only">
            <Menu.Item key={"switch-org"}>
                <span>切换组织</span>
            </Menu.Item>
            <Menu.Item key={"change-pwd"}>
                  <span>修改密码</span>
            </Menu.Item>
            <Menu.Item key={"log-out"}>
                <span>退出登录</span>
            </Menu.Item>

        </Menu>
    );

    return (
         <Layout className="app_layout">
             <EffSideMenu/>
             <Content className="app_content">
                     <EffBreadCrumb breads={breads}/>
                     <Dropdown  overlayStyle={{width:'200px'}} overlay={menu} visible={orgMenuVisible}  placement="bottomRight" >
                         <EffUser onClick={response.userClick} id={currentMember.id} name={currentMember.name} size={24} className="current-user cursor-pointer"/>
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
