import React from "react";

interface IProps{
    name:string,
    color:string,
    className?:string,
}
export default function EffStatus(props:IProps){
    const {className, name, color} = props

    return (
        <div style={{
            border: '1px solid ' + color,
            padding: '3px',
            fontSize:'12px',
            height: '20px',
            color: color,
        }} className={`d-flex justify-center align-center ${className}`}>
            {name}
        </div>
    )
}
