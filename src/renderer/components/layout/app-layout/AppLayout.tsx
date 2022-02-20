import React, { useEffect, useState } from 'react';
import { Dropdown, Layout, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import EffUser from '@components/eff-user/eff-user';
import { accountThunks } from '@slice/accountSlice';
import { imgSwitch, imgQuit, imgProfile } from '@config/svgImg';
import ElgoProfile from '@pages/profile/profile';
import { useNavigate, Outlet } from 'react-router-dom';
import EffSideMenu from '@components/business/eff-side-menu/eff-side-menu';
import { RootState } from '@store/store';
import EffBreadCrumb from '@components/eff-breadcrumb/eff-breadcrumb';
import '../../../assets/css/app.less';

const { Content } = Layout;

const AppLayout = () => {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const [showProfile, setShowProfile] = useState(false);
    const breads = useSelector((state: RootState) => state.breadcrumb.breadcrumbs);
    const currentUser = useSelector((state: RootState) => state.account.currentUser);

    useEffect(() => {
        dispatch(accountThunks.getCurrentUser());
    }, []);

    const response = {
        dropdownMenuSelected: ({ key, domEvent }: { key: any; domEvent: any }) => {
            domEvent.stopPropagation();

            switch (key) {
                case 'switch-org':
                    navigator('/app/org-switch');
                    break;
                case 'change-pwd':
                    setShowProfile(true);
                    break;
                case 'log-out':
                    dispatch(accountThunks.clearLocalStorage());
                    navigator('/account');
                    break;
                default:
                    break;
            }
        },
    };

    const menu = (
        <Menu onClick={response.dropdownMenuSelected} className="user-menu">
            <Menu.Item className="menu-item" key="switch-org">
                <span>{imgSwitch} 切换组织</span>
            </Menu.Item>
            <Menu.Item className="menu-item" key="change-pwd">
                <span>{imgProfile} 个人设置</span>
            </Menu.Item>
            <Menu.Item className="menu-item" key="log-out">
                <span>{imgQuit} 退出登录</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout className="app_layout">
            <EffSideMenu />
            <Content className="app_content">
                <EffBreadCrumb breads={breads} />
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                    <EffUser img={currentUser.avatar} id={currentUser.id} name={currentUser.name} size={24} className="current-user cursor-pointer" />
                </Dropdown>
                <ElgoProfile onClose={() => setShowProfile(false)} visible={showProfile} />
                <Outlet />
            </Content>
        </Layout>
    );
};

export default AppLayout;