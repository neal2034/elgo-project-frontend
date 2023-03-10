import React, { useEffect, useState } from 'react';
import HomeLogo from '@imgs/elgo-logo.png';
import { Form, Input } from 'antd';
import EffButton from '@components/eff-button/eff-button';
import { useDispatch, useSelector } from 'react-redux';
import { orgThunks } from '@slice/orgSlice';
import { effToast } from '@components/common/eff-toast/eff-toast';
import md5 from 'md5';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '@store/store';

export default function ActiveUser() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const [activeForm] = Form.useForm();
    const activeUserStatus = useSelector((state: RootState) => state.organization.activeUserStatus);
    const [title, setTitle] = useState<string>();
    const [isAvailable, setIsAvailable] = useState(true);
    const { token } = useParams();

    useEffect(() => {
        dispatch(orgThunks.checkInviteToken({ token: token as string }));
    }, []);

    useEffect(() => {
        if (activeUserStatus === 1) {
            setTitle('请设置密码');
            setIsAvailable(false);
            effToast.error('激活链接已失效，请联系管理员');
        } else if (activeUserStatus === 0) {
            setTitle('请设置密码');
        } else if (activeUserStatus === -1) {
            setTitle('您已有Elgo账户，请输入密码');
        }
    }, [activeUserStatus]);

    const response = {
        activeUser: async () => {
            const values = await activeForm.validateFields();
            const password = md5(values.password);
            const data = {
                token: token as string,
                password,
                boolNew: activeUserStatus === 0,
            };
            const result: any = await dispatch(orgThunks.activeUser(data));
            if (result) {
                effToast.success('用户激活成功');
                navigator('/account');
            }
        },
    };

    return (
        <div className="signup">
            <div className="content">
                <img alt="logo" src={HomeLogo} width={200} className="logo" />

                <Form form={activeForm} className="signup-form mt20">
                    <span className="title">{title}</span>
                    <Form.Item name="password" className="mt20" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input disabled={!isAvailable} type="password" placeholder="请输入密码" />
                    </Form.Item>
                    <EffButton disabled={!isAvailable} onClick={response.activeUser} className="mb20 mt20" text="确定" type="filled" round width={330} />
                </Form>
            </div>
        </div>
    );
}
