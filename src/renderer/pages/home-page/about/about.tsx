import React from "react";
import './about.less'
import ImgBuild from '@imgs/building.png'
import globalColor from "@config/globalColor";


export default function ElgoAbout(){
    return (
        <div className="elgo-about d-flex align-center justify-center">
            <div className="d-flex-column align-center justify-center">
                <img src={ImgBuild}/>
                <span style={{
                    fontSize:'40px',
                    color:globalColor.fontWeak
                }}>关于页面建设中 。。。</span>
            </div>
        </div>
    )
}
