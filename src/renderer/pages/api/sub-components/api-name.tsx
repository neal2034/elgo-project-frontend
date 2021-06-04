/**
 * 组件： api 名称
 */
import React from "react";
import {API} from "@slice/apiSlice";

interface ApiProps{
    api: API
}

export default function ApiName(props:ApiProps){
    const {name} = props.api || {}
    return (
        <div>{name}</div>
    )
}
