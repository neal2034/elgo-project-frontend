import React from "react";
import {Avatar} from "antd";
import {colors} from '../../config/sysConstants'
import './eff-user.less'

interface User{
    id:number,
    name:string|number,
    size:number,
    style?:object,
    [x:string]:any
}

export default function EffUser(props:User){
    const {name,size, style,id, ...rest} = props
    let key = typeof name === 'string'? name[0].toUpperCase():"+"+name
    let avatarSize = typeof name === 'string'? size:30
    let colorIndex = id % colors.length
    let color = colors[colorIndex]
    let userStyle = {backgroundColor: color, flexShrink:0}
    if(style){
        userStyle = {...style, ...userStyle}
    }
    return (
        <Avatar {...rest}   style={userStyle} size={avatarSize}>{key}</Avatar>
    )
}
