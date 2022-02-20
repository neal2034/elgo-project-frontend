import React from 'react';
import HomeLogo from '@imgs/elgo-logo.png';
import { Form, Input } from 'antd';
import EffButton from '@components/eff-button/eff-button';
import { useDispatch } from 'react-redux';
import { orgThunks } from '@slice/orgSlice';
import { useParams } from 'react-router-dom';
import md5 from 'md5';
import { effToast } from '@components/common/eff-toast/eff-toast';
import useNavigation from '@/hooks/useNavigator';
import './signup.less';

export default function NewOrganization() {
    const dispatch = useDispatch();
    const navigator = useNavigation();
    const { token } = useParams();
    const isNew = token === 'new';
    const title = isNew ? '创建新组织' : '激活Elgo账号';
    const [newOrgForm] = Form.useForm();

    const response = {
        newOrg: async () => {
            const values = await newOrgForm.validateFields();
            const { name } = values;
            if (!token) throw new Error('not token found');

            if (isNew) {
                const result: any = await dispatch(orgThunks.addAnotherOrganization({ name }));
                if (result) {
                    effToast.success('新组织创建成功');
                    navigator.goLogin();
                }
            } else {
                // 激活账号
                const password = md5(values.password);
                const result: any = await dispatch(orgThunks.addOrganization({ name, password, token }));
                if (result) {
                    effToast.success('账号激活成功');
                    navigator.goLogin();
                }
            }
        },
    };

    return (
        <div className="signup">
            <div className="content">
                <img alt="logo" src={HomeLogo} width={200} className="logo" />

                <Form form={newOrgForm} className="signup-form mt20">
                    <span className="title-des">{title}</span>

                    {!isNew && (
                        <Form.Item name="password" className="mt20" rules={[{ required: true, message: '请设置账号密码' }]}>
                            <Input type="password" placeholder="请设置账号密码" />
                        </Form.Item>
                    )}

                    <Form.Item name="name" className="mt20" rules={[{ required: true, message: '请输您的入组织名称' }]}>
                        <Input placeholder="请输入您的组织名称" />
                    </Form.Item>

                    <EffButton onClick={response.newOrg} className="mb20 mt20" text="确定" type="filled" round width={330} />
                </Form>
            </div>
        </div>
    );
}
