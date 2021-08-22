import React from "react";
import {Tag} from "antd";

interface IEffTagAreaProps{
    tags:any[]
}

export default function EffTagArea(props:IEffTagAreaProps){
    const {tags} = props

    const ui = {
        uiTags : tags.map(item=><Tag className="mr5" key={item.id} color={item.color}>{item.name}</Tag>)
    }

    return (
         <React.Fragment>
             {ui.uiTags}
         </React.Fragment>
    )
}
