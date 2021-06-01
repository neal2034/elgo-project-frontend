import React from "react";
import {Tabs} from "antd";
import ConfigParams from "./config-params";
import {API} from "../apiSlice";
import ConfigAuth from "./config-auth";
import EffJsonEditor from "./eff-json-editor";
import ConfigBody from "./config-body";
import ConfigTest from "./config-test";

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

            <TabPane tab="Headers" key="3">here is Headers</TabPane>

            <TabPane className="tab-content"  tab="Body" key="4">
                <ConfigBody api={props.api}/>
            </TabPane>

            <TabPane tab="Tests" key="5">
                <ConfigTest/>
            </TabPane>
        </Tabs>
    )
}
