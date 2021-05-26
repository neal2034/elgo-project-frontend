import React from "react";
import {Select,Input,Button} from "antd";

const {Option}  = Select


export default function ApiUrlArea(){

    return (
        <div className="d-flex">
            <Select style={{ width: 120 }} value={"get"}>
                <Option value="get">Get</Option>
                <Option value="post">Post</Option>
                <Option value="put">Put</Option>
                <Option value="delete">Delete</Option>
            </Select>
            <Input/>
            <Button>发送</Button>
            <Button>保存</Button>
        </div>
    )
}
