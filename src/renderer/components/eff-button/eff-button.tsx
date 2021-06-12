import React from "react";
import {Button} from "antd";
import Colors from '@config/globalColor';
import globalColor from "@config/globalColor";

interface IEffButtonProps {
    text: string,
    round?: boolean,
    key: string,
    type?: "filled" | "normal",
    onClick?: () => void,
    className?:string,
    disabled?:boolean,
}

interface IBtnStyle {
    color?:string,
    backgroundColor?:string,
    opacity?:number
}

export default function EffButton(props:IEffButtonProps){
    const {text, round, type="normal", disabled=false, ...restProps} = props
    let btnShape: 'round'|'circle'| undefined = round? 'round': undefined

    let btnStyle:IBtnStyle  = {}
    switch (type){
        case "normal":
            btnStyle.color = globalColor.fontNormal
            break
        case "filled":
            btnStyle.color = 'white'
            btnStyle.backgroundColor = globalColor.mainYellow;
            break
    }

    if(disabled){
        btnStyle.opacity = .6
    }



    return <Button disabled={disabled} shape={btnShape}  style={btnStyle} {...restProps} >{text}</Button>
}
