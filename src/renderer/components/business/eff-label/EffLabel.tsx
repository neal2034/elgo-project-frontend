import React from "react";
import globalColor from "@config/globalColor";



export default function EffLabel(props:{name:string}){
    const {name} = props
    const style = {
        label:{
            color:globalColor.fontWeak,
            fontSize: '14px',
            width: '60px',
            whiteSpace: "nowrap" as const
        }
    }


    return  <span className="mr40" style={style.label}>{name}</span>

}
