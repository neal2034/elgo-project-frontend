/**
 * 组件： 用于描述内容区Tab 区域
 */
import React, { useEffect, useState } from 'react';
import './api-wrapper.less';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import { apiActions, apiThunks } from '@slice/apiSlice';
import IconSetting from '@imgs/setting.png';
import ApiTab from './api-tab';
import { RootState } from '../../../store/store';
import ApiEnvsDlg from '../dialogs/api-envs-dialog';

const { Option } = Select;

interface IApiTabsProps{
    maxContentWidth:number
}

export default function ApiTabs(props:IApiTabsProps) {
    const { maxContentWidth } = props;
    const dispatch = useDispatch();
    const [apiEnvDlgVisible, setApiEnvDlgVisible] = useState(false);
    const envs = useSelector((state:RootState) => state.api.envs);
    const activeApis = useSelector((state:RootState) => state.api.activeApis);
    const activeTabs = activeApis.map((item) => <ApiTab api={item} key={item.serial} />);

    const handleAddActiveApi = () => {
        dispatch(apiActions.addActiveApi());
    };

    useEffect(() => {
        dispatch(apiThunks.listApiEnvs());
    }, [dispatch]);

    const handler = {
        closeEnvDlg: () => {
            setApiEnvDlgVisible(false);
        },
        envSelectChange: (envId:number) => {
            dispatch(apiActions.setCurrentEnv(envId));
        },
    };

    const ui = {
        envOptions: () => {
            const defaultOption = <Option key={-1} value={-1}>未指定环境</Option>;
            const envOptions = envs.map((env:any) => <Option key={env.id} value={env.id}>{env.name}</Option>);
            envOptions.splice(0, 0, defaultOption);
            return envOptions;
        },
    };

    return (
        <div className="d-flex justify-between">
            <div className="tabs d-flex" style={{ maxWidth: `${maxContentWidth}px` }}>
                <div className="tab-wrapper">
                    {activeTabs}
                </div>
                <div onClick={handleAddActiveApi} className="btn-add d-flex justify-center align-center cursor-pointer">
                    <PlusOutlined />
                </div>
            </div>
            <div className="d-flex align-center env-selector mb5">
                <Select onChange={handler.envSelectChange} defaultValue={-1} placeholder="未指定环境" style={{ width: '200px' }}>
                    {ui.envOptions()}
                </Select>
                <div onClick={() => setApiEnvDlgVisible(true)}>
                    <img alt="setting" src={IconSetting} className="ml5 cursor-pointer" width={14} height={14} />
                </div>
            </div>
            <ApiEnvsDlg visible={apiEnvDlgVisible} onClose={handler.closeEnvDlg} />
        </div>

    );
}
