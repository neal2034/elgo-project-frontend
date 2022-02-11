import React from 'react';
import { Form, Input } from 'antd';
import EffButton from '@components/eff-button/eff-button';
import { useParams } from 'react-router-dom';
import md5 from 'md5';
import { accountThunks } from '@slice/accountSlice';
import { effToast } from '@components/common/eff-toast/eff-toast';
import { useAppDispatch } from '../../../store/store';

interface IRestPwdProps {
    goLogin: () => void;
}

export default function ResetPwd(props: IRestPwdProps) {
    const { goLogin } = props;
    const [resetForm] = Form.useForm();
    const { token } = useParams();
    const dispatch = useAppDispatch();
    const handlers = {
        handleSubmit: async () => {
            const values = await resetForm.validateFields();
            const password = md5(values.password);
            const result = await dispatch(accountThunks.resetPassword({ token: token!, password }));
            if (result.isSuccess) {
                effToast.success('密码设置成功');
                goLogin();
            }
        },
        // 校验密码一致
        validateConfirmPwd: (rule: any, value: any, callback: any) => {
            const values = resetForm.getFieldsValue();
            if (values.password && values.confirmPwd && values.password !== values.confirmPwd) {
                callback('两次密码输入不一致');
                return;
            }
            callback();
        },
    };

    return (
        <Form requiredMark={false} labelCol={{ span: 5 }} colon={false} className="mt20" form={resetForm}>
            <Form.Item label="新密码" name="password" rules={[{ required: true, message: '请输入新密码' }]}>
                <Input.Password />
            </Form.Item>

            <Form.Item label="再次输入" name="confirmPwd" rules={[{ required: true, message: '请再次输入新密码' }, { validator: handlers.validateConfirmPwd }]}>
                <Input.Password />
            </Form.Item>

            <EffButton onClick={handlers.handleSubmit} className="mt20" text="确定" type="filled" width="100%" size="middle" round />
        </Form>
    );
}
