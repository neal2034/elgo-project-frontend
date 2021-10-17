import { AppContainer as ReactHotContainer } from 'react-hot-loader';
import React, { Fragment, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './store/store';
import Pages from './Pages';

const AppContainer = process.env.NODE_ENV === 'development' ? ReactHotContainer : Fragment;

ReactDOM.render(
    <AppContainer>
        <Provider store={store}>
            <SnackbarProvider maxSnack={3} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Pages />
                </Suspense>

            </SnackbarProvider>
        </Provider>
    </AppContainer>,
    document.getElementById('app'),
);
