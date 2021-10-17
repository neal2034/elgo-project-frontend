import React from 'react';
import { PRIORITY } from '@config/sysConstant';

interface IProps{
    value:string,
    className?:string,
}

export default function EffPriority(props:IProps) {
    const { value, className } = props;
    const name = PRIORITY[value] && PRIORITY[value].name;
    const color = PRIORITY[value] && PRIORITY[value].color;

    return (
        <div
            style={{
                border: `1px solid ${color}`,
                padding: '3px',
                fontSize: '12px',
                height: '20px',
                color,
            }}
            className={`d-flex justify-center align-center ${className}`}
        >
            {name}
        </div>
    );
}
