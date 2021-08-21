import React from "react";

interface IUserProps{
    name:string
}

export default function EffUser(props:IUserProps){
    const {name} = props
    const letter = name[0].toUpperCase()
    return (
        <div className="eff-user">
            {letter}
        </div>
    )
}
