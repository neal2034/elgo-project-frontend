import React from 'react';

interface IProps{
    goBackLogin: () => void
}

export default function InvalidReset(props: IProps) {
    const { goBackLogin } = props;
    return (
        <div className="invalid-reset">
            <span>密码重置链接已失效，请重新发送。</span>
            <span onClick={goBackLogin} className="back-login">返回登录</span>
        </div>
    );
}
