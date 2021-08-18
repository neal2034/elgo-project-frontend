import React from "react";
import './eff-breadcrumb.less'

interface BreadCrumbProps{
    breads:any[]
}

export default function EffBreadCrumb(props:BreadCrumbProps){
    let {breads} = props
    return (
        <div className="breads mt20 ml20">{breads && breads.length>0 && breads[0]}</div>
    )
}
