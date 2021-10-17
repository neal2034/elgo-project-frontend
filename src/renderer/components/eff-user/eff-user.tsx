import React from 'react';
import { Avatar } from 'antd';
import { USER_COLORS } from '@config/sysConstant';
import './eff-user.less';

interface User{
    id:number,
    name:string|number,
    size:number,
    img?:string, // 头像地址
    style?:any,
    [x:string]:any
}

export default function EffUser(props:User) {
    const {
        img, name, size, style, id, ...rest
    } = props;
    const key = typeof name === 'string' ? name[0].toUpperCase() : `+${name}`;
    const avatarSize = typeof name === 'string' ? size : 30;
    const color = USER_COLORS[id % USER_COLORS.length];
    let userStyle = { backgroundColor: color, flexShrink: 0 };
    if (style) {
        userStyle = { ...style, ...userStyle };
    }
    return (
        <Avatar {...rest} src={img} style={userStyle} size={avatarSize}>{key}</Avatar>
    );
}
