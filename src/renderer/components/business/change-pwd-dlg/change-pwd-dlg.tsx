import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './change-pwd-dlg.less';
import EffButton from '@components/eff-button/eff-button';
import md5 from 'md5';
import { useDispatch } from 'react-redux';
import { userThunks } from '@slice/userSlice';
import { effToast } from '@components/common/eff-toast/eff-toast';

interface IProps{
    visible:boolean
    onClose: ()=>void
}

export default function ChangePwdDlg(props:IProps) {
    const dispatch = useDispatch();
    const { visible } = props;
    const [pwdForm] = Form.useForm();
    const [confirmValidate, setConfirmValidate] = useState<any>();
    const [confirmHelpMsg, setConfirmHelpMsg] = useState<string>();
    const [passwordValidate, setPasswordValidate] = useState<any>();
    const [passwordHelpMsg, setPasswordHelpMsg] = useState<string>();

    const response = {
        handleSubmit: async () => {
            const values = await pwdForm.validateFields();
            if (values.newPassword !== values.confirmPassword) {
                setConfirmValidate('error');
                setConfirmHelpMsg('两次密码输入不一致');
                return;
            }
            if (values.newPassword === values.password) {
                setConfirmValidate('error');
                setConfirmHelpMsg('新密码与旧密码一致');
                return;
            }
            const oldPassword = md5(values.password);
            const newPassword = md5(values.newPassword);
            const result:any = await dispatch(userThunks.changePwd({ oldPassword, newPassword }));
            if (result === 0) {
                effToast.success('密码修改成功');
                response.closeDlg();
            } else if (result === 410) {
                setPasswordHelpMsg('原密码不正确');
                setPasswordValidate('error');
            }
        },
        clearError: () => {
            setConfirmValidate(undefined);
            setPasswordValidate(undefined);
            setPasswordHelpMsg(undefined);
            setConfirmHelpMsg(undefined);
        },
        closeDlg: () => {
            pwdForm.resetFields();
            props.onClose();
        },
    };

    return (
        <Modal footer={null} title={null} closable={false} visible={visible}>
            <div className="change-pwd-dlg">
                <div className="d-flex header justify-between align-center mb20">
                    <span>修改密码</span>
                    <CloseOutlined onClick={response.closeDlg} className="close" />
                </div>

                <Form requiredMark={false} className="password-form" labelCol={{ span: 4 }} colon={false} form={pwdForm}>
                    <Form.Item
                        help={passwordHelpMsg}
                        validateStatus={passwordValidate}
                        name="password"
                        label="原密码"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input onFocus={response.clearError} type="password" />
                    </Form.Item>

                    <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '请输入新密码' }]}>
                        <Input onFocus={response.clearError} type="password" />
                    </Form.Item>

                    <Form.Item
                        help={confirmHelpMsg}
                        validateStatus={confirmValidate}
                        name="confirmPassword"
                        label="确认密码"
                        rules={[{ required: true, message: '请再次输入新密码' }]}
                    >
                        <Input onFocus={response.clearError} type="password" />
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
