import React from "react";
import {Layout} from "antd";
import PrivateRoute from "./routes/privateRoute";
import OrganizationHome from "./pages/organizationHome/organizationHome";
import {Switch} from "react-router-dom";
import EffSideMenu from "./components/eff-side-menu/effSideMenu";

const {Content} = Layout


const App = () => {
    return (
         <Layout className="app_layout">
             <EffSideMenu/>
             <Content className="app_content">
                 <Switch>
                     <PrivateRoute path="/app/organization" component={OrganizationHome}/>
                 </Switch>
             </Content>
         </Layout>
    )
}


export default App;
