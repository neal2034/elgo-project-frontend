import React from "react";
import './blog.less'
import ImgBuild from '@imgs/building.png'
import globalColor from "@config/globalColor";


export default function ElgoBlog(){
    return (
        <div className="elgo-blog d-flex align-center justify-center">
            <div className="d-flex-column align-center justify-center">
                <img src={ImgBuild}/>
                <span style={{
                    fontSize:'40px',
                    color:globalColor.fontWeak
                }}>社区建设中 。。。</span>
            </div>
        </div>
    )
}
