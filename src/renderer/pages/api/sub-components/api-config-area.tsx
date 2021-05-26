import React from "react";
import {Tabs} from "antd";

const {TabPane} = Tabs


export default function ApiConfigArea(){

    return (
        <Tabs>
            <TabPane tab="Params" key="1">here is params</TabPane>
            <TabPane tab="Authorization" key="2">here is Authorization</TabPane>
            <TabPane tab="Headers" key="3">here is Headers</TabPane>
            <TabPane tab="Body" key="4">here is Body</TabPane>
            <TabPane tab="Tests" key="5">here is Tests</TabPane>
        </Tabs>
    )
}
