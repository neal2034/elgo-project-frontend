import { AppContainer as ReactHotContainer } from 'react-hot-loader';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store'
const AppContainer = process.env.NODE_ENV === 'development' ? ReactHotContainer : Fragment;

function App() {
    return (
        <div>
             <h1>test</h1>
        </div>
    );
}



ReactDOM.render(
    <AppContainer>
        <Provider store={store}>
            <App/>
        </Provider>
    </AppContainer>,
    document.getElementById('app')
);
