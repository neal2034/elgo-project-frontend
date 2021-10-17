import React from 'react';
import ImgLogo from '@imgs/elgo-logo.png';

export default function SideHeader() {
    return (
        <div>
            <img alt="logo" className="ml20 mt20" src={ImgLogo} width={120} />
        </div>
    );
}
