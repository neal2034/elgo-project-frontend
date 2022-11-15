import React, { useEffect, useState } from 'react';
import { Dropdown, Layout } from 'antd';
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

    const menuItems = [
        { key: 'switch-org', label: '切换组织', icon: imgSwitch, className: 'menu-item' },
        { key: 'change-pwd', label: '个人设置', icon: imgProfile, className: 'menu-item' },
        { key: 'log-out', label: '退出登录', icon: imgQuit, className: 'menu-item' },
    ];


    return (
        <Layout className="app_layout">
            <EffSideMenu />
            <Content className="app_content">
                <EffBreadCrumb breads={breads} />
                <Dropdown menu={{items:menuItems, onClick:response.dropdownMenuSelected}} trigger={['click']} placement="bottomRight">
                    <EffUser img={currentUser.avatar} id={currentUser.id} name={currentUser.name} size={24} className="current-user cursor-pointer" />
                </Dropdown>
                <ElgoProfile onClose={() => setShowProfile(false)} visible={showProfile} />
                <Outlet />
            </Content>
        </Layout>
    );
};

export default AppLayout;
