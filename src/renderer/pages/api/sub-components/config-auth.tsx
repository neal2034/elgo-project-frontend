import React from "react";
import {API} from "@slice/apiSlice";
import {Select, Input} from "antd";
import './api-wrapper.less'
import {updateCurrentApi} from '@slice/apiSlice'
import {useDispatch} from "react-redux";

const {Option} = Select

interface ApiProps{
    api: API
}


export default function ConfigAuth(props:ApiProps){
    const {authType='INHERIT', authToken} = props.api
    const dispatch = useDispatch();

    const handler = {
        handleAuthTypeChange:(value:any)=>{
            dispatch(updateCurrentApi({authType:value}))
        },

        handleAuthTokenChange:(e:any)=>{
            dispatch(updateCurrentApi({authToken:e.target.value}))
        }
    }

    return (
        <div className="d-flex justify-between config-auth">
        <div className="d-flex align-center">
            <span  className="mr10">鉴权类型</span>
            <Select onChange={handler.handleAuthTypeChange} value={authType} style={{ width: 200 }}>
                <Option value="INHERIT">继承</Option>
                <Option value="NONE">无</Option>
                <Option value="BEARER">Bearer Token</Option>
            </Select>
        </div>

            {'BEARER' === authType? <div className="d-flex align-center">
                <span className="mr10">Token</span>
                <Input value={authToken} onChange={handler.handleAuthTokenChange}/>
            </div>:null}
    </div>
    )
}
