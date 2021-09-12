import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PageNotFound from "./components/pages/PageNotFound";
import Login from "./pages/account/login";
import App from "./App";
import {SnackbarProvider} from "notistack";



export default function Pages(){



  return ( <Router>

      <SnackbarProvider maxSnack={3} autoHideDuration={2000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Switch>
            <Route exact path="/" render={() => <Redirect to='/app/project-center' push/>}/>
            <Route path="/app" component={App}/>
            <Route exact path="/not" component={PageNotFound}/>
            <Route path="/login" component={Login}/>
        </Switch>
      </SnackbarProvider>
    </Router>)
}
