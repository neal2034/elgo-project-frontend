import React from 'react';
import Img404 from '@imgs/404.png';

// eslint-disable-next-line react/prefer-stateless-function
class PageNotFound extends React.Component {
    render() {
        return <img alt="not found" src={Img404} />;
    }
}

export default PageNotFound;
