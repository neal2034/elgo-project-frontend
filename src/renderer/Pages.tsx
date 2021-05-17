import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PageNotFound from "./components/pages/PageNotFound";
import Login from "./pages/account/login";
import OrganizationHome from "./pages/organizationHome/organizationHome";
import PrivateRoute from "./routes/privateRoute";


export default ()=> {
  return ( <Router>
        <div>
            {window.location.pathname.includes('index.html') && <Redirect to="/"/>}
        </div>
        <Switch>
            <Route exact path="/" render={() => <Redirect to='/organization' push/>}/>
            <PrivateRoute path="/organization" component={OrganizationHome}/>
            <Route exact path="/not" component={PageNotFound}/>
            <Route path="/login" component={Login}/>
        </Switch>
    </Router>)
};
