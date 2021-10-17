import React from 'react';
import { Tabs } from 'antd';
import { API } from '@slice/apiSlice';
import ConfigParams from './config-params';
import ConfigAuth from './config-auth';
import ConfigBody from './config-body';
import ConfigTest from './config-test';
import ConfigHeader from './config-header';

const { TabPane } = Tabs;
interface ApiProps{
    api: API
}

export default function ApiConfigArea(props:ApiProps) {
    const { api } = props;
    return (
        <Tabs className="config-tabs">
            <TabPane tab="Params" key="1">
                <ConfigParams api={api} />
            </TabPane>

            <TabPane tab="Authorization" key="2">
                <ConfigAuth api={api} />
            </TabPane>

            <TabPane tab="Headers" key="3">
                <ConfigHeader api={api} />
            </TabPane>

            <TabPane className="tab-content" tab="Body" key="4">
                <ConfigBody api={api} />
            </TabPane>

            <TabPane tab="Tests" key="5">
                <ConfigTest api={api} />
            </TabPane>
        </Tabs>
    );
}
