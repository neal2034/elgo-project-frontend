import React, { useState } from 'react';
import './project-setting.less';
import { Outlet, useNavigate } from 'react-router-dom';

import SettingMenus from './setting-menus';

export default function ProjectSetting() {
    const navigator = useNavigate();
    const [activeKey, setActiveKey] = useState('members');

    const menus = [
        { key: 'members', name: '项目成员' },
        { key: 'tags', name: '标签' },
        { key: 'sources', name: '需求来源' },
        { key: 'versions', name: '版本' },
    ];

    const response = {
        menuSelected: (key: string) => {
            setActiveKey(key);
            navigator(`${key}`);
        },
    };

    return (
        <div className="pl40 pt40 d-flex">
            <SettingMenus activeKey={activeKey} menuSelected={response.menuSelected} menus={menus} />
            <div className="ml40 mr40 flex-grow-1">
                <Outlet />
            </div>
        </div>
    );
}
