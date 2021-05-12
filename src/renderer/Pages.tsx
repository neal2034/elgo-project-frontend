import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PageNotFound from "./components/pages/PageNotFound";
import Login from "./pages/account/login";

export default ()=>(
    <Router>
        <Switch>
            <Route exact path="/not" component={PageNotFound}/>
            <Route   path="/" component={Login}/>

        </Switch>
    </Router>
);
