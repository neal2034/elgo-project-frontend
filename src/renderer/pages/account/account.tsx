import React, { useEffect, useState } from 'react';
import './account.less';
import HomeLogo from '@imgs/elgo-logo.png';
import Login from '@pages/account/login/login';
import ForgetPwd from '@pages/account/forget-pwd/forget-pwd';
import ForgetMailSend from '@pages/account/forget-mail-send/forget-mail-send';
import ResetPwd from '@pages/account/reset-pwd/reset-pwd';
import InvalidReset from '@pages/account/invalid-reset/invalid-reset';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { accountThunks } from '@slice/accountSlice';
import { useAppDispatch } from '../../store/store';

export enum AccountPageStatus {
    LOGIN,
    FORGET_PWD,
    FORGET_MAIL_SEND,
    RESET_PWD,
    INVALID,
    WAIT,
}

interface IAccountProps {
    status: AccountPageStatus;
}

export default function Account(props: IAccountProps) {
    const { status: initStatus } = props;
    const [status, setStatus] = useState(AccountPageStatus.WAIT);
    const [title, setTitle] = useState('');
    const [forgetPwdEmail, setForgetPwdEmail] = useState('');
    const { token } = useParams();
    const dispatch = useAppDispatch();
    const handlers = {
        goForgetPwd: () => {
            setStatus(AccountPageStatus.FORGET_PWD);
            setTitle('忘记密码?');
        },
        sentForgetPwdEmail: (email: string) => {
            setForgetPwdEmail(email);
            setStatus(AccountPageStatus.FORGET_MAIL_SEND);
        },
        goLogin: () => {
            setStatus(AccountPageStatus.LOGIN);
            setTitle('登录');
        },
    };
    useEffect(() => {
        if (initStatus === AccountPageStatus.RESET_PWD) {
            dispatch(accountThunks.checkRetrievePwdToken({ token: token! })).then(result => {
                if (result.isSuccess) {
                    setTitle('重置密码');
                    setStatus(AccountPageStatus.RESET_PWD);
                } else {
                    setTitle('链接失效');
                    setStatus(AccountPageStatus.INVALID);
                }
            });
        } else if (initStatus === AccountPageStatus.LOGIN) {
            setTitle('登录');
            setStatus(initStatus);
        }
    }, []);

    return (
        <div className="account">
            <div className="content-wrap">
                <img src={HomeLogo} alt="logo" className="logo" />
                <div className="content mt20">
                    <span className="title">{title}</span>
                    {status === AccountPageStatus.WAIT && <Spin className="spin" wrapperClassName="spin" size="large" />}
                    {status === AccountPageStatus.LOGIN && <Login goForgetPwd={handlers.goForgetPwd} />}
                    {/* eslint-disable-next-line max-len */}
                    {status === AccountPageStatus.FORGET_PWD && <ForgetPwd backLogin={handlers.goLogin} sentForgetPwdEmail={handlers.sentForgetPwdEmail} />}
                    {status === AccountPageStatus.FORGET_MAIL_SEND && <ForgetMailSend username={forgetPwdEmail} />}
                    {status === AccountPageStatus.RESET_PWD && <ResetPwd goLogin={handlers.goLogin} />}
                    {status === AccountPageStatus.INVALID && <InvalidReset goBackLogin={handlers.goLogin} />}
                </div>
            </div>
        </div>
    );
}
