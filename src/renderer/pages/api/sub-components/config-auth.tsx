import React from "react";
import {API} from "@slice/apiSlice";
import {Select, Input} from "antd";
import './api-wrapper.less'

const {Option} = Select

interface ApiProps{
    api: API
}


export default function ConfigAuth(props:ApiProps){

    return (
        <div className="d-flex justify-between config-auth">
        <div className="d-flex align-center">
            <span  className="mr10">鉴权类型</span>
            <Select defaultValue="INHERIT" style={{ width: 200 }}>
                <Option value="INHERIT">继承</Option>
                <Option value="NONE">无</Option>
                <Option value="BEARER">Bearer Token</Option>
            </Select>
        </div>

            <div className="d-flex align-center">
                <span className="mr10">Token</span>
                <Input></Input>
            </div>
    </div>
    )
}
