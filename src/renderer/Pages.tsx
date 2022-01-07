import React from 'react';
import {
    HashRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { effToast } from '@components/common/eff-toast/eff-toast';
import Account, { AccountPageStatus } from '@pages/account/account';
import PageNotFound from './components/pages/PageNotFound';
import NewOrg from './pages/signup/new-org';
import Signup from './pages/signup/signup';
import HomePage from './pages/home-page/home-page';
import ActiveUser from './pages/signup/active-user';

export default function Pages() {
    const App = React.lazy(() => import('./App'));

    // 全局设置 snack bar
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    effToast.setSnackBar(enqueueSnackbar, closeSnackbar);

    // 若为桌面端则直接进入登录
    const isElectron = process.env.RUN_ENV === 'pc';
    const homePath = isElectron ? '/account' : '/home';

    return (
        <Router>
            <Switch>
                <Route exact path="/" render={() => <Redirect to={homePath} push />} />
                <Route path="/home" component={HomePage} />
                <Route path="/signup" component={Signup} />
                <Route path="/new-org/:token" component={NewOrg} />
                <Route path="/active/:token" component={ActiveUser} />
                <Route path="/app" component={App} />
                <Route exact path="/not" component={PageNotFound} />
                <Route path="/account" render={() => <Account status={AccountPageStatus.LOGIN} />} />
                <Route path="/reset-pwd/:token" render={() => <Account status={AccountPageStatus.RESET_PWD} />} />
            </Switch>
        </Router>
    );
}
