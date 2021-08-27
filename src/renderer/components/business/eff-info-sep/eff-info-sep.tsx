import React from "react";
import globalColor from "@config/globalColor";

/**
 * 该组件用于表示详情当中的信息分割
 * @constructor
 */
export default function EffInfoSep(props:{name:string, className?:string}){
    const {name, className} = props

    const style = {
        info:{
            borderLeft: '3px solid '+globalColor.mainYellowDark,
            paddingLeft: '10px',
            fontSize: '14px',
            fontWeight: 500,
        }
    }


    return <div className={className} style={style.info}>{name}</div>

}
