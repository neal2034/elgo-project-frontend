import React from "react";
import {Layout} from "antd";
import PrivateRoute from "./routes/privateRoute";
import OrganizationHome from "./pages/organizationHome/organizationHome";
import ProjectHome from "./pages/projectHome/projectHome";
import {Switch} from "react-router-dom";
// import EffSideMenu from "./components/eff-side-menu/effSideMenu";
import EffSideMenu from "./components/business/eff-side-menu/eff-side-menu";
import Api from "./pages/api/api";
import OrgSwitch from "./pages/orgSwitch/orgSwitch";
import {useSelector} from "react-redux";
import {RootState} from "./store/store";
import EffBreadCrumb from "./components/eff-breadcrumb/eff-breadcrumb";
import ProjectCenter from "./pages/project-center/project-center";

const {Content} = Layout


const App = () => {
    let breads = useSelector((state:RootState)=>state.breadcrumb.breadcrumbs)
    return (
         <Layout className="app_layout">
             <EffSideMenu/>
             <Content className="app_content">
                 <EffBreadCrumb breads={breads}/>
                     <Switch>
                         <PrivateRoute path="/app/organization" component={OrganizationHome}/>
                         <PrivateRoute component={ProjectHome} path="/app/project"/>
                         <PrivateRoute component={OrgSwitch} path="/app/org-switch" />
                         <PrivateRoute component={Api} path="/app/api" />
                         <PrivateRoute component={ProjectCenter} path={'/app/project-center'}/>
                     </Switch>
             </Content>
         </Layout>
    )
}


export default App;
