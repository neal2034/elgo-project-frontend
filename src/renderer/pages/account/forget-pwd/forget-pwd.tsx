import React from 'react';
import { Form, Input } from 'antd';
import EffButton from '@components/eff-button/eff-button';
import { useDispatch } from 'react-redux';
import { accountThunks } from '@slice/accountSlice';
import { effToast } from '@components/common/eff-toast/eff-toast';

interface IForgetPwdProps{
    sentForgetPwdEmail: (username: string) => void,
    backLogin: () => void,
}

export default function ForgetPwd(props: IForgetPwdProps) {
    const { sentForgetPwdEmail, backLogin } = props
    const dispatch = useDispatch()
    const handlers = {
        sentMail: async (values:any) => {
            const result:any = await dispatch(accountThunks.sentForgetPwdEmail(values))
            if (result.status === 100002) {
                effToast.warning('用户不存在');
            }
            if (result.status === 0) {
                sentForgetPwdEmail(values.email)
            }
        },
    }
    return (
        <Form onFinish={handlers.sentMail} className="mt20 form-forget-pwd">
            <Form.Item name="email" rules={[{ required: true, message: '请输入账号' }, { type: 'email', message: '请输入正确的邮箱' }]}>
                <Input placeholder="请输入账号 (邮箱地址)" />
            </Form.Item>
            <EffButton className="mt40" htmlType="submit" size="middle" text="确定" type="filled" round width="100%" />
            <span onClick={backLogin} className="text-go-back">返回登录</span>
        </Form>
    )
}
