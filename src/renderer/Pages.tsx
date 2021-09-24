import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PageNotFound from "./components/pages/PageNotFound";
import Login from "./pages/account/login";
import App from "./App";
import {SnackbarProvider, useSnackbar} from "notistack";
import HomePage from "./pages/home-page/home-page";
// import Signup from "./pages/signup/signup";
import Signup from "./pages/signup/signup";
import {effToast} from "@components/common/eff-toast/eff-toast";
import NewOrg from "./pages/signup/new-org";



export default function Pages(){

    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    effToast.setSnackBar(enqueueSnackbar,closeSnackbar)

  return ( <Router>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path={"/signup"} component={Signup} />
            <Route path={"/new-org/:token"} component={NewOrg} />
            <Route path="/app" component={App}/>
            <Route exact path="/not" component={PageNotFound}/>
            <Route path="/login" component={Login}/>
        </Switch>
    </Router>)
}
