/**
 * 组件： 用于描述API Tab
 */
import React from 'react';
import { API, apiActions } from '@slice/apiSlice';
import { CloseOutlined } from '@ant-design/icons';
import './api-wrapper.less';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { RootState } from '../../../store/store';

interface ApiProps{
    api:API
}

export default function ApiTab(props:ApiProps) {
    const { api } = props;
    const {
        name, method, isExample, dirty, serial,
    } = api;
    const dispatch = useDispatch();

    const currentApiSerial = useSelector((state:RootState) => state.api.currentApiSerial);
    const isActive = currentApiSerial === serial;

    const methodColorClass = () => {
        let methodName = method === 'DELETE' ? 'DEL' : method;
        methodName = methodName.toLowerCase();
        return `${methodName}-method`;
    };

    const handler = {
        handleTabClick: () => {
            dispatch(apiActions.setCurrentApiSerial(serial));
        },
        handleClose: () => {
            dispatch(apiActions.removeActiveApi(serial));
        },
    };

    return (
        <Tooltip title={name} mouseEnterDelay={0.5} color="#999999">
            <div onClick={handler.handleTabClick} className={`api-tab  ${isActive ? 'active-tab' : ''} `}>
                <div className="d-flex align-center">
                    {isExample ? <div className="example mr5">例</div>
                        : <span className={`method ${methodColorClass()}`}>{method.toUpperCase()}</span>}
                    <span className="name-area">{name}</span>
                </div>
                <div className="d-flex">
                    {dirty ? <div className="dirty" /> : null}
                    <CloseOutlined onClick={handler.handleClose} className="btn-close" />
                </div>
            </div>
        </Tooltip>
    );
}
