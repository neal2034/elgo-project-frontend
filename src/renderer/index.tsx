import { AppContainer as ReactHotContainer } from 'react-hot-loader';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './store/store';
import App from './App';

const AppContainer = process.env.NODE_ENV === 'development' ? ReactHotContainer : Fragment;

ReactDOM.render(
    <AppContainer>
        <Provider store={store}>
            <SnackbarProvider
                maxSnack={3}
                autoHideDuration={2000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <App />
            </SnackbarProvider>
        </Provider>
    </AppContainer>,
    document.getElementById('app')
);
