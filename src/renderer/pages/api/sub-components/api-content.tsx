import React, {useEffect, useRef, useState} from "react";
import ApiTabs from "./api-tabs";
import './api-wrapper.less'
import ApiName from "./api-name";
import ApiExample from "./api-example";
import ApiUrlArea from "./api-url-area";
import ApiConfigArea from "./api-config-area";
import ApiResponse from "./api-response";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import ImgApiCloud from "@imgs/api-cloud.png"

export default function ApiContent(){

    const [contentWidth, setContentWidth] = useState<number>(0); //内容区宽度
    const currentApi = useSelector( (state:RootState)=>state.api.activeApis.filter(item=>item.serial===state.api.currentApiSerial)[0])
    const hasApi = !!currentApi
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        let theWidth = contentRef.current!.offsetWidth-200;
        setContentWidth(theWidth);
    },[])


    return (
        <div ref={contentRef} className="api-content ml10 d-flex-column">
            <ApiTabs maxContentWidth={contentWidth}/>
          {hasApi? <div className="content-wrapper">
                <div className="d-flex justify-between name-example-area">
                    <ApiName api={currentApi}/>
                    <ApiExample/>
                </div>
                <div className="ml10 mr10">
                    <ApiUrlArea api={currentApi}/>
                </div>
                <div className="config-area">
                    <ApiConfigArea api={currentApi}/>
                </div>
                <div>
                    <ApiResponse/>
                </div>
            </div>:
            <div className="content-wrapper  d-flex justify-center align-center">
                 <img src={ImgApiCloud}/>
            </div>}
        </div>
    )
}
