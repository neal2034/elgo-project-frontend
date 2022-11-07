import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import EffButton from '@components/eff-button/eff-button';
import './change-email-dlg.less';
import { userThunks } from '@slice/userSlice';
import md5 from 'md5';
import { effToast } from '@components/common/eff-toast/eff-toast';
import { accountThunks, login } from '@slice/accountSlice';
import { orgThunks } from '@slice/orgSlice';

export default function ChangeEmailDlg(props: {
    visible:boolean,
    onClose: ()=>void
}) {
    const dispatch = useDispatch();
    const { visible, onClose } = props;
    const [emailForm] = Form.useForm();
    const [passwordErrMsg, setPasswordErrMsg] = useState<string>();
    const [passwordValidate, setPasswordValidate] = useState<any>();
    const [emailErrMsg, setEmailErrMsg] = useState<string>();
    const [emailValidate, setEmailValidate] = useState<any>();
    const [emailTimes, setEmailTimes] = useState(0);
    const [tokenValidate, setTokenValidate] = useState<any>();
    const [tokenErrMsg, setTokenErrMsg] = useState<string>();
    const inputWidth = '260px';
    const response = {
        closeDlg: () => {
            emailForm.resetFields();
            onClose();
        },
        handleSubmit: async () => {
            const values = await emailForm.validateFields();
            const status:any = await dispatch(userThunks.changeEmail({ token: values.token, email: values.email }));
            if (status === 0) {
                // 修改成功
                effToast.success('邮箱修改成功');
                const result:any = await dispatch(login({ username: values.email, password: md5(values.password) }));
                if (result) {
                    dispatch(accountThunks.getCurrentUser());
                    dispatch(orgThunks.getOrganizationDetail());
                }
                response.closeDlg();
            } else if (status === 100005) {
                // 验证码错误
                setTokenValidate('error');
                setTokenErrMsg('验证码不正确');
            } else if (status === 402) {
                // 验证码失效
                setTokenErrMsg('验证码已过期，请重新发送');
                setTokenValidate('error');
            }
        },
        getToken: async () => {
            const values = await emailForm.validateFields(['email', 'password']);
            const status:any = await dispatch(userThunks.sendChangeEmailToken({ password: md5(values.password), email: values.email }));
            if (status === 0) {
                // 成功发送邮件
                effToast.success('验证码已发送，请查看邮箱');
                setEmailTimes(emailTimes + 1);
            } else if (status === 200003) {
                // 用户邮箱已占用
                setEmailValidate('error');
                setEmailErrMsg('该邮箱已注册');
            } else if (status === 410) {
                // 密码无效
                setPasswordErrMsg('密码不正确');
                setPasswordValidate('error');
            }
        },
        clearError: () => {
            setTokenValidate('success');
            setTokenErrMsg('');
            setEmailValidate('success');
            setEmailErrMsg('');
            setPasswordValidate('success');
            setPasswordErrMsg('');
        },
    };

    return (
        <Modal footer={null} title={null} closable={false} open={visible}>
            <div className="change-email-dlg">
                <div className="d-flex header justify-between align-center mb20">
                    <span>修改登录邮箱</span>
                    <CloseOutlined onClick={response.closeDlg} className="close" />
                </div>
                <Form requiredMark={false} className="change-email-form" labelCol={{ span: 4 }} colon={false} form={emailForm}>
                    <Form.Item
                        validateStatus={passwordValidate}
                        help={passwordErrMsg}
                        label="登录密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input onFocus={response.clearError} type="password" style={{ width: inputWidth }} />
                    </Form.Item>
                    <Form.Item
                        help={emailErrMsg}
                        validateStatus={emailValidate}
                        label="新邮箱"
                        name="email"
                        rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱' }]}
                    >
                        <div className="d-flex   align-center">
                            <Input onFocus={response.clearError} style={{ width: inputWidth }} />
                            {emailTimes === 0 && <span onClick={response.getToken} className="action cursor-pointer ml20">获取验证码</span> }
                            {emailTimes === 1 && (
                                <span className="sent-msg ml20">
                                    未收到?
                                    <span onClick={response.getToken} className="cursor-pointer action">重新发送</span>
                                </span>
                            )}
                            {emailTimes === 2 && <span className="sent-msg ml20">已发送</span>}
                        </div>
                    </Form.Item>
                    <Form.Item
                        validateStatus={tokenValidate}
                        help={tokenErrMsg}
                        label="验证码"
                        name="token"
                        rules={[{ required: true, message: '请输入验证码' }]}
                    >
                        <Input onFocus={response.clearError} style={{ width: inputWidth }} />
                    </Form.Item>

                </Form>

                <div className="self-flex-end mb20">
                    <EffButton onClick={response.closeDlg} type="line" round key="cancel" text="取消" />
                    <EffButton onClick={response.handleSubmit} className="ml10" round type="filled" key="ok" text="确定" />
                </div>
            </div>

        </Modal>
    );
}
