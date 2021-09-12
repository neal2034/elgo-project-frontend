import React from "react";
import ImgLogo from '@imgs/logo.png'


export default function SideHeader(){
    return (
        <div>
            <img className="ml20 mt20" src={ImgLogo} width={120}/>
        </div>
    )
}
