import React from 'react';
import { API, apiActions } from '@slice/apiSlice';
import { Select, Input } from 'antd';
import './api-wrapper.less';
import { useDispatch } from 'react-redux';

const { Option } = Select;

interface ApiProps{
    api: API
}

export default function ConfigAuth(props:ApiProps) {
    const { api } = props;
    const { authType = 'INHERIT', authToken } = api;
    const dispatch = useDispatch();

    const handler = {
        handleAuthTypeChange: (value:any) => {
            dispatch(apiActions.updateCurrentApi({ authType: value }));
        },

        handleAuthTokenChange: (e:any) => {
            dispatch(apiActions.updateCurrentApi({ authToken: e.target.value }));
        },
    };

    return (
        <div className="d-flex justify-between config-auth">
            <div className="d-flex align-center">
                <span className="mr10">鉴权类型</span>
                <Select onChange={handler.handleAuthTypeChange} value={authType} style={{ width: 200 }}>
                    <Option value="INHERIT">继承</Option>
                    <Option value="NONE">无</Option>
                    <Option value="BEARER">Bearer Token</Option>
                </Select>
            </div>

            {authType === 'BEARER' ? (
                <div className="d-flex align-center">
                    <span className="mr10">Token</span>
                    <Input value={authToken} onChange={handler.handleAuthTokenChange} />
                </div>
            ) : null}
        </div>
    );
}
