import React from 'react';
import { Button } from 'antd';
import globalColor from '@config/globalColor';

interface IEffButtonProps {
    text: string,
    round?: boolean,
    key?: string,
    width?: number,
    type?: 'filled' | 'normal' | 'line',
    className?:string,
    disabled?:boolean,
    [x:string]:any,
}

interface IBtnStyle {
    color?:string,
    backgroundColor?:string,
    opacity?:number,
    border?:string,
    width?: string | number,
    [x:string]: string | number | undefined,
}

export default function EffButton(props:IEffButtonProps) {
    const {
        text, round, width = '100', type = 'normal', disabled = false, ...restProps
    } = props;
    const btnShape: 'round'|'circle'| undefined = round ? 'round' : undefined;

    const btnStyle:IBtnStyle = {};
    btnStyle.width = width;
    switch (type) {
    case 'line':
        btnStyle.color = globalColor.mainYellowDark;
        btnStyle.borderColor = globalColor.mainYellowDark;
        btnStyle.fontWeight = 'bold';

        break;
    case 'normal':
        btnStyle.color = globalColor.fontNormal;
        break;
    case 'filled':
        btnStyle.color = 'white';
        btnStyle.backgroundColor = globalColor.mainYellowDark;
        btnStyle.border = 'none';
        btnStyle.fontWeight = 'bold';
        break;
    default:
        break;
    }

    if (disabled) {
        btnStyle.opacity = 0.6;
    }

    return <Button disabled={disabled} shape={btnShape} style={btnStyle} {...restProps}>{text}</Button>;
}
