import React from 'react';
import { Route, Redirect, BrowserRouterProps as RouteProps } from 'react-router-dom';
import umbrella from 'umbrella-storage';

interface PrivateRouteProps extends RouteProps{
    component:any,
    path:string,
}

export default function PrivateRoute(props:PrivateRouteProps) {
    const { component: Component, ...rest } = props;
    const hasToken = !!umbrella.getLocalStorage('token');
    return (
        <Route
            {...rest}
            render={(routeProps) => (
                hasToken ? <Component {...routeProps} />
                    : (
                        <Redirect to={{
                            pathname: '/login',
                            state: { from: routeProps.location },
                        }}
                        />
                    )
            )}
        />
    );
}
