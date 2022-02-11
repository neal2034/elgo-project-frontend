import React, { useState } from 'react';
import HomeLogo from '@imgs/elgo-logo.png';
import './home-page.less';
import { Outlet, useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigator = useNavigate();

    const [homeKey, setHomeKey] = useState('home');
    const menus = [
        // TODO 暂时不做帮助 待合适时机
        // {menuKey:'help', path:'/home/help', name:'帮助'},
        { menuKey: 'blog', path: '/home/blog', name: '社区' },
        { menuKey: 'download', path: '/home/download', name: '下载' },
        { menuKey: 'about', path: '/home/about', name: '关于' },
    ];
    const response = {
        goLogin: () => {
            navigator('/account');
        },
        goSignup: () => {
            navigator('/signup');
        },
        menuClick: (menu: any) => {
            navigator(menu.path);
            setHomeKey(menu.menuKey);
        },
        goHome: () => {
            navigator('/');
        },
    };

    return (
        <div className="elgo-home d-flex-column">
            <div className="header d-flex justify-between align-center">
                <div className="d-flex align-center">
                    <div onClick={response.goHome}>
                        <img alt="logo" className="cursor-pointer" style={{ height: '36px' }} src={HomeLogo} />
                    </div>
                    <div className="d-flex align-center menus">
                        {menus.map(item => (
                            // eslint-disable-next-line max-len
                            <span key={item.menuKey} onClick={() => response.menuClick(item)} className={`menu-item ${homeKey === item.menuKey ? 'active' : ''}`}>
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="btn-group d-flex align-center">
                    <div onClick={response.goLogin} className="login btn">
                        登录
                    </div>
                    <div onClick={response.goSignup} className="btn signup ml20">
                        注册
                    </div>
                </div>
            </div>

            <Outlet />

            <div className="copyright justify-center align-center d-flex">
                Copyright ©1998-2021 Elgo All Rights Reserved
                <a rel="noreferrer" className="ml20" target="_blank" href="https://beian.miit.gov.cn">
                    陕ICP备17005318号-4
                </a>
            </div>
        </div>
    );
}
