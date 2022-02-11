import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orgThunks } from '@slice/orgSlice';
import './org-switch.less';
import umbrella from 'umbrella-storage';
import { useNavigate } from 'react-router-dom';
import { setBreadcrumbs } from '@slice/breadcrumbSlice';
import { RootState } from '../../store/store';

export default function OrgSwitch() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    useEffect(() => {
        dispatch(setBreadcrumbs([]));
    }, [dispatch]);
    const orgList = useSelector((state: RootState) => state.organization.orgList);

    useEffect(() => {
        dispatch(orgThunks.listOrganizations());
    }, []);

    const response = {
        switchOrg: (serial: string) => {
            umbrella.setLocalStorage('oserial', serial);
            navigator('/app/project-center');
        },
    };

    const organizations = orgList.map((org: any) => (
        <div key={org.serial} onClick={() => response.switchOrg(org.serial)} className="one-org">
            <span className="name">{org.name}</span>
            <span className="join-date ml20">
                加入日期:
                {org.joinDate.substr(0, 10)}
            </span>
        </div>
    ));
    return (
        <div className="organization-selector">
            <span className="title">请选择需要进入的组织</span>
            <div>{organizations}</div>
        </div>
    );
}
