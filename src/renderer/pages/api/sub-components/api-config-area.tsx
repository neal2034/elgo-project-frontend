import React from "react";
import {Tabs} from "antd";
import ConfigParams from "./config-params";
import {API} from "@slice/apiSlice";
import ConfigAuth from "./config-auth";
import ConfigBody from "./config-body";
import ConfigTest from "./config-test";
import ConfigHeader from "./config-header";

const {TabPane} = Tabs
interface ApiProps{
    api: API
}

export default function ApiConfigArea(props:ApiProps){


    return (
        <Tabs className="config-tabs">
            <TabPane tab="Params" key="1">
                <ConfigParams api={props.api}/>
            </TabPane>

            <TabPane tab="Authorization" key="2">
                <ConfigAuth api={props.api}/>
            </TabPane>

            <TabPane tab="Headers" key="3">
                <ConfigHeader api={props.api} />
            </TabPane>

            <TabPane className="tab-content"  tab="Body" key="4">
                <ConfigBody api={props.api}/>
            </TabPane>

            <TabPane tab="Tests" key="5">
                <ConfigTest api={props.api}/>
            </TabPane>
        </Tabs>
    )
}
