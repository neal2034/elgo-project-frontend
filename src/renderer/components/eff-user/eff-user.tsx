import React from "react";
import {Avatar} from "antd";
import {colors} from '@config/sysConstant'
import './eff-user.less'

interface User{
    id:number,
    name:string|number,
    size:number,
    style?:any,
    [x:string]:any
}

export default function EffUser(props:User){
    const {name,size, style,id, ...rest} = props
    const key = typeof name === 'string'? name[0].toUpperCase():"+"+name
    const avatarSize = typeof name === 'string'? size:30
    const colorIndex = id % colors.length
    const color = colors[colorIndex]
    let userStyle = {backgroundColor: color, flexShrink:0}
    if(style){
        userStyle = {...style, ...userStyle}
    }
    return (
        <Avatar {...rest}   style={userStyle} size={avatarSize}>{key}</Avatar>
    )
}
