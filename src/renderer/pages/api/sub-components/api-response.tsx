import React from "react";
import {Tabs} from "antd";

const {TabPane} = Tabs


export default function ApiResponse(){
    return (
        <div>
            <Tabs>
                <TabPane tab="Response" key="1">here is response</TabPane>
            </Tabs>
        </div>
    )
}
