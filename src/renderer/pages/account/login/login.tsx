import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import md5 from 'md5';
import { login } from '@slice/accountSlice';
import { effToast } from '@components/common/eff-toast/eff-toast';
import { Form, Input } from 'antd';
import EffButton from '@components/eff-button/eff-button';
import umbrella from 'umbrella-storage';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    goForgetPwd: () => void;
}

export default function Login(props: LoginProps) {
    const { goForgetPwd } = props;
    const dispatch = useDispatch();
    const navigator = useNavigate();
    useEffect(() => {
        const token = umbrella.getLocalStorage('token');
        if (token) {
            navigator('/app/project-center');
        }
    }, []);
    const handlers = {
        goLogin: async (values: any) => {
            const { username } = values;
            const password = md5(values.password);
            const result: any = await dispatch(login({ username, password }));
            if (result) {
                navigator('/app/project-center');
            } else {
                effToast.error('用户名或密码有误');
            }
        },
    };

    return (
        <Form onFinish={handlers.goLogin} className="mt20 login">
            <Form.Item
                name="username"
                rules={[
                    { required: true, message: '请输入账号' },
                    { type: 'email', message: '请输入正确的邮箱' },
                ]}
            >
                <Input placeholder="请输入账号(邮箱地址)" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <EffButton htmlType="submit" size="middle" text="确定" type="filled" round width="100%" />
            <span onClick={goForgetPwd} className="text-forget-pwd">
                忘记密码?
            </span>
        </Form>
    );
}
