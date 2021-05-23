import React from "react";

interface BreadCrumbProps{
    breads:any[]
}

export default function EffBreadCrumb(props:BreadCrumbProps){
    let {breads} = props
    return (
        <div className="breads mt10 ml20">{breads && breads.length>0 && breads[0]}</div>
    )
}
