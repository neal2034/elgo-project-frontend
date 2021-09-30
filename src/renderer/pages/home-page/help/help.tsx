import React from "react";
import './help.less'
import ImgBuild from '@imgs/building.png'
import globalColor from "@config/globalColor";


export default function ElgoHelp(){
    return (
        <div className="elgo-help d-flex align-center justify-center">
             <div className="d-flex-column align-center justify-center">
                 <img src={ImgBuild}/>
                 <span style={{
                     fontSize:'40px',
                     color:globalColor.fontWeak
                 }}>帮助页面建设中 。。。</span>
             </div>
        </div>
    )
}
