import React from "react";
import {Layout} from "antd";
import PrivateRoute from "./routes/privateRoute";
import OrganizationHome from "./pages/organizationHome/organizationHome";
import ProjectHome from "./pages/projectHome/projectHome";
import {Switch} from "react-router-dom";
import EffSideMenu from "./components/eff-side-menu/effSideMenu";
import Api from "./pages/api/api";

const {Content} = Layout


const App = () => {
    return (
         <Layout className="app_layout">
             <EffSideMenu/>
             <Content className="app_content">
                 <Switch>
                     <PrivateRoute path="/app/organization" component={OrganizationHome}/>
                     <PrivateRoute component={ProjectHome} path="/app/project"/>
                     <PrivateRoute component={Api} path="/app/api" />
                 </Switch>
             </Content>
         </Layout>
    )
}


export default App;
