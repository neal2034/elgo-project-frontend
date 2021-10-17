import React from 'react';
import { Tabs } from 'antd';
import ImgRocket from '@imgs/rocket.png';
import ImgSave from '@imgs/save.png';
import './api-response.less';
import { API, apiActions } from '@slice/apiSlice';
import { useDispatch } from 'react-redux';
import EffCodeEditor from '../../../components/eff-code-editor/effCodeEditor';

const { TabPane } = Tabs;

interface IApiProps{
    api:API
}

export default function ApiResponse(props:IApiProps) {
    const { api } = props;
    const { responseBody, isExample = false } = api;
    const dispatch = useDispatch();
    let responseText;
    if (responseBody) {
        responseText = JSON.stringify(responseBody, null, 2);
    }

    const handler = {
        goAddApiExample: () => {
            dispatch(apiActions.addApiExample());
        },
        occupy: () => {
            // TODO 替换该函数
        },
    };

    const saveAction = !isExample ? (
        <div className="btn-save mr10" onClick={handler.goAddApiExample}>
            <img alt="save" src={ImgSave} width={12} className="mr5" />
            保存响应
        </div>
    ) : null;

    return (
        <div className="api-response">
            {!responseBody ? (
                <div className="empty">
                    <img width={90} src={ImgRocket} alt="response" />
                    <span className="mt10">点击发送获得请求响应</span>
                </div>
            ) : (
                <Tabs tabBarExtraContent={saveAction}>
                    <TabPane tab="Body" key="1">
                        <EffCodeEditor readonly value={responseText} mode="json" onChange={handler.occupy} />
                    </TabPane>
                </Tabs>
            )}
        </div>
    );
}
