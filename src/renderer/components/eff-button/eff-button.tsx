import React from "react";
import {Button} from "antd";
import Colors from '@config/globalColor';
import globalColor from "@config/globalColor";

interface IEffButtonProps {
    text: string,
    round?: boolean,
    key: string,
    type?: "filled" | "normal",
    onClick?: () => void
}

interface IBtnStyle {
    color?:string,
    backgroundColor?:string,
}

export default function EffButton(props:IEffButtonProps){
    const {text, round, type="normal", ...restProps} = props
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



    return <Button shape={btnShape}  style={btnStyle} {...restProps} >{text}</Button>
}
