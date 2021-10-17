import React, { useEffect, useState } from 'react';
import HomeLogo from '@imgs/elgo-logo.png';
import './home-page.less';
import { Route, useHistory } from 'react-router';
import { Switch, useRouteMatch } from 'react-router-dom';
import HomeContent from './home-conetnt/home-content';
import AppDownload from './app-download/app-download';
import ElgoHelp from './help/help';
import ElgoAbout from './about/about';
import ElgoBlog from './blog/blog';

export default function HomePage() {
    const history = useHistory();
    const { path } = useRouteMatch();
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
            history.push('/login');
        },
        goSignup: () => {
            history.push('/signup');
        },
        menuClick: (menu:any) => {
            history.push(menu.path);
            setHomeKey(menu.menuKey);
        },
        goHome: () => {
            history.push('/');
        },
    };

    useEffect(() => {
        const defaultPath = `${path}/content`;
        history.push(defaultPath);
    }, []);

    return (
        <div className="elgo-home d-flex-column">
            <div className="header d-flex justify-between align-center">
                <div className="d-flex align-center">
                    <div onClick={response.goHome}>
                        <img alt="logo" className="cursor-pointer" style={{ height: '36px' }} src={HomeLogo} />
                    </div>
                    <div className="d-flex align-center menus">
                        {menus.map((item) => (
                            <span
                                key={item.menuKey}
                                onClick={() => response.menuClick(item)}
                                className={`menu-item ${homeKey === item.menuKey ? 'active' : ''}`}
                            >
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="btn-group d-flex align-center">
                    <div onClick={response.goLogin} className="login btn">登录</div>
                    <div onClick={response.goSignup} className="btn signup ml20">注册</div>
                </div>
            </div>

            <Switch>
                <Route path="/home/content" component={HomeContent} />
                <Route path="/home/download" component={AppDownload} />
                <Route path="/home/help" component={ElgoHelp} />
                <Route path="/home/about" component={ElgoAbout} />
                <Route path="/home/blog" component={ElgoBlog} />
            </Switch>
            <div className="copyright justify-center align-center d-flex">
                Copyright ©1998-2021 Elgo All Rights Reserved
                <a rel="noreferrer" className="ml20" target="_blank" href="https://beian.miit.gov.cn">陕ICP备17005318号-4</a>
            </div>

        </div>
    );
}
