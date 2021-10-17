import React, { useEffect, useState } from 'react';
import './project-setting.less';
import { useParams, useRouteMatch, Switch } from 'react-router-dom';
import PrivateRoute from '@components/common/private-route/private-route';
import { useHistory } from 'react-router';
import SettingMenus from './setting-menus';
import MemberSetting from './member-setting/member-setting';
import TagSetting from './tag-setting/tag-setting';
import ReqSourceSetting from './req-source-setting/pro-req-source-setting';
import VersionSetting from './version-setting/version-setting';

export default function ProjectSetting() {
    const { path } = useRouteMatch();
    const { serial } = useParams();
    const history = useHistory();
    const [activeKey, setActiveKey] = useState('members');
    const basePath = path.replace(':serial', serial);

    const menus = [
        { key: 'members', name: '项目成员' },
        { key: 'tags', name: '标签' },
        { key: 'sources', name: '需求来源' },
        { key: 'versions', name: '版本' },
    ];

    useEffect(() => {
        const defaultPath = `${basePath}/members`;
        history.push(defaultPath);
    }, []);

    const response = {
        menuSelected: (key:string) => {
            setActiveKey(key);
            history.push(`${basePath}/${key}`);
        },
    };

    return (
        <div className="pl40 pt40 d-flex">
            <SettingMenus activeKey={activeKey} menuSelected={response.menuSelected} menus={menus} />
            <div className="ml40 mr40 flex-grow-1">
                <Switch>
                    <PrivateRoute component={MemberSetting} path={`${path}/members`} />
                    <PrivateRoute component={TagSetting} path={`${path}/tags`} />
                    <PrivateRoute component={ReqSourceSetting} path={`${path}/sources`} />
                    <PrivateRoute component={VersionSetting} path={`${path}/versions`} />
                </Switch>

            </div>
        </div>
    );
}
