import { AppContainer as ReactHotContainer } from 'react-hot-loader';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store'
const AppContainer = process.env.NODE_ENV === 'development' ? ReactHotContainer : Fragment;
import Pages from "./Pages";
import {SnackbarProvider} from "notistack";



ReactDOM.render(
    <AppContainer>
        <Provider store={store}>
            <SnackbarProvider maxSnack={3} autoHideDuration={2000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
            <Pages />
            </SnackbarProvider>
        </Provider>
    </AppContainer>,
    document.getElementById('app')
);
