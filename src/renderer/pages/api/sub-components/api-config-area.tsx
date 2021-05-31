import React from "react";
import {Tabs} from "antd";
import ConfigParams from "./config-params";
import {API} from "../apiSlice";

const {TabPane} = Tabs
interface ApiProps{
    api: API
}

export default function ApiConfigArea(props:ApiProps){


    return (
        <Tabs>
            <TabPane tab="Params" key="1">
                <ConfigParams api={props.api}/>
            </TabPane>
            <TabPane tab="Authorization" key="2">here is Authorization</TabPane>
            <TabPane tab="Headers" key="3">here is Headers</TabPane>
            <TabPane tab="Body" key="4">here is Body</TabPane>
            <TabPane tab="Tests" key="5">here is Tests</TabPane>
        </Tabs>
    )
}
