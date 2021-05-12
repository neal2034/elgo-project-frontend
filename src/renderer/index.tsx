import { AppContainer as ReactHotContainer } from 'react-hot-loader';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store'
const AppContainer = process.env.NODE_ENV === 'development' ? ReactHotContainer : Fragment;
import Pages from "./Pages";



ReactDOM.render(
    <AppContainer>
        <Provider store={store}>
            <Pages />
        </Provider>
    </AppContainer>,
    document.getElementById('app')
);
