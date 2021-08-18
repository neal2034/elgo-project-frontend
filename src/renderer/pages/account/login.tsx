import React from 'react'
import  './login.less'
import { Form, Input, Button, message } from 'antd';
import EffLogo from "@imgs/effwork-logo.png"
import {useDispatch} from "react-redux";
import {login} from './accountSlice'
import md5 from 'md5'
import {useHistory} from "react-router";



export default function Login(){

    const dispatch = useDispatch();
    const history = useHistory();


    const handleSubmit = async (values: any) => {
        let username = values.username
        let password = md5(values.password)
        // @ts-ignore
         dispatch(login({username,password})).then(result=>{
             if(result){
                history.push("/app/project-center")
             }else{
                 message.error('用户名或密码有误')
             }
        })
    };

        return (
            <div className="login">
                <div className="content">
                    <img src={EffLogo} className="logo" />
                    <Form onFinish={handleSubmit}  className="login-form mt20">
                        <span className="title">登录</span>
                        <Form.Item name="username"  className="mt20" rules={[{ required: true, message: '请输入账号' }]}>
                            <Input placeholder="请输入账号(邮箱地址)" />
                        </Form.Item>

                        <Form.Item name="password"  rules={[{ required: true, message: '请输入密码' }]}>
                            <Input.Password placeholder="请输入密码" />
                        </Form.Item>

                        <Button shape="round"   htmlType="submit" block type="primary" style={{ background: "#FAB04F", borderColor: "#FAB04F" }}>登录</Button>
                    </Form>
                </div>
            </div>
        );

}
