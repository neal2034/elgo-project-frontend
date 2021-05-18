import React from "react";
import {Avatar} from "antd";
import {colors} from '../../config/sysConstants'

interface User{
    id:number,
    name:string|number,
    size:number,
    style?:object,
    [x:string]:any
}

export default function EffUser(props:User){
    const {name,size, style,id} = props
    let key = typeof name === 'string'? name[0].toUpperCase():"+"+name
    let avatarSize = typeof name === 'string'? size:30
    let colorIndex = id % colors.length
    let color = colors[colorIndex]
    let userStyle = {backgroundColor: color}
    if(style){
        userStyle = {...style, ...userStyle}
    }
    return (
        <Avatar   style={userStyle} size={avatarSize}>{key}</Avatar>
    )
}
