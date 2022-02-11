import React, { useEffect } from 'react';
import { Layout } from 'antd';
import './eff-side-menu.less';
import { HomeOutlined, UsergroupAddOutlined, CheckSquareOutlined, BugOutlined } from '@ant-design/icons';
import Colors from '@config/globalColor';
import { useDispatch, useSelector } from 'react-redux';
import { menuActions } from '@slice/menuSlice';
import { useNavigate } from 'react-router-dom';
import { setBreadcrumbs } from '@slice/breadcrumbSlice';
import { RootState } from '../../../store/store';
import MenuItem from '../menu/menu-item/menu-item';
import SideHeader from './side-header';

const { Sider } = Layout;

export default function EffSideMenu() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const activeMenu = useSelector((state: RootState) => state.menu.activeMenu);
    const mainMenus = [
        {
            name: '项目中心',
            icon: (
                <HomeOutlined
                    style={{
                        fontSize: '16px',
                        color: '#666666',
                    }}
                />
            ),
            activeIcon: (
                <HomeOutlined
                    style={{
                        fontSize: '16px',
                        color: Colors.mainYellowDark,
                    }}
                />
            ),
            key: 'home',
            path: '/app/project-center',
        },
        {
            name: '我的任务',
            icon: (
                <CheckSquareOutlined
                    style={{
                        fontSize: '16px',
                        color: '#666666',
                    }}
                />
            ),
            activeIcon: (
                <CheckSquareOutlined
                    style={{
                        fontSize: '16px',
                        color: Colors.mainYellowDark,
                    }}
                />
            ),
            key: 'my-task',
            path: '/app/my-task',
        },
        {
            name: '我的Bug',
            icon: (
                <BugOutlined
                    style={{
                        fontSize: '16px',
                        color: '#666666',
                    }}
                />
            ),
            activeIcon: (
                <BugOutlined
                    style={{
                        fontSize: '16px',
                        color: Colors.mainYellowDark,
                    }}
                />
            ),
            key: 'my-bug',
            path: '/app/my-bug',
        },
        {
            name: '组织成员',
            icon: (
                <UsergroupAddOutlined
                    style={{
                        fontSize: '16px',
                        color: '#666666',
                    }}
                />
            ),
            activeIcon: (
                <UsergroupAddOutlined
                    style={{
                        fontSize: '16px',
                        color: Colors.mainYellowDark,
                    }}
                />
            ),
            key: 'org-member',
            path: '/app/org-member',
        },
    ];

    useEffect(() => {
        // 根据当前路由设置当前激活菜单
        const path = window.location.hash;
        const menu = mainMenus.filter(item => path.endsWith(item.path))[0];
        if (menu && menu.key !== activeMenu) {
            const activeMenuKey = menu ? menu.key : null;
            const activeMenuName = menu ? menu.name : null;
            dispatch(menuActions.setActiveMenu(activeMenuKey));
            dispatch(setBreadcrumbs([activeMenuName]));
        }
        if (!menu) {
            dispatch(menuActions.setActiveMenu(null));
        }
    });

    return (
        <Sider width="180" className="side-menu">
            <SideHeader />
            <div className="mt40 menus">
                {mainMenus.map(item => (
                    // eslint-disable-next-line max-len
                    <MenuItem key={item.key} onClick={() => navigator(item.path)} className="mt20" name={item.name} icon={item.icon} activeIcon={item.activeIcon} isActive={activeMenu === item.key} />
                ))}
            </div>
        </Sider>
    );
}
