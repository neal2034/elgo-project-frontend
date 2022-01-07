import React from 'react';

interface IMailSend{
    username: string
}

export default function ForgetMailSend(props: IMailSend) {
    const { username } = props
    return (
        <div className="forget-mail-sent mt20">
            <span className="mt20">
                密码修改链接已发送至邮箱
                {username}
            </span>
            <span className="mt20">链接有效期 5 分钟</span>
        </div>
    )
}
