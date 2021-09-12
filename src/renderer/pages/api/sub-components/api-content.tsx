import React, {useEffect, useRef, useState} from "react";
import ApiTabs from "./api-tabs";
import './api-wrapper.less'
import ApiName from "./api-name";
import ApiExample from "./api-example";
import ApiUrlArea from "./api-url-area";
import ApiConfigArea from "./api-config-area";
import ApiResponse from "./api-response";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import ImgApiCloud from "@imgs/api-cloud.png"
import EffButton from "../../../components/eff-button/eff-button";
import {CaretLeftOutlined} from '@ant-design/icons'
import {Input} from "antd";
import {apiThunks, apiActions} from '@slice/apiSlice'
import ApiDescription from "./api-description";


export default function ApiContent(){
    const dispatch = useDispatch();
    const [contentWidth, setContentWidth] = useState<number>(0); //内容区宽度
    const currentApi = useSelector( (state:RootState)=>state.api.activeApis.filter(item=>item.serial===state.api.currentApiSerial)[0])
    const isShowDescription = useSelector((state:RootState)=>state.api.showDescription)
    const hasApi = !!currentApi
    const isExample = currentApi &&  currentApi.isExample
    const contentRef = useRef<HTMLDivElement>(null)
    const saveExampleBtnDisabled = currentApi? (!currentApi.exampleName || !currentApi.dirty):false

    useEffect(()=>{
        const theWidth = contentRef.current!.offsetWidth-400;
        setContentWidth(theWidth);
    },[])

    const handler = {
        saveApiExample: ()=>{
            dispatch(apiThunks.saveApiExample())
        },

        exampleNameChanged: (e:any)=>{
            dispatch(apiActions.updateCurrentApi({exampleName:e.target.value}))
        }
    }

    const requestName = isExample?  <div className="ml20 mb10">请求:</div>:null;


    return (
        <div ref={contentRef} className="api-content ml10 d-flex-column">
            <ApiTabs maxContentWidth={contentWidth}/>
          {hasApi? <div className="content-wrapper">
                  {isExample?
                      <div className="d-flex justify-between align-center name-example-area">
                      <div className="cursor-pointer">
                          <CaretLeftOutlined />
                          <span>{currentApi.name}</span>
                      </div>
                      <EffButton disabled={saveExampleBtnDisabled} onClick={handler.saveApiExample} type={"filled"}  text={"保存案例"} key={"save-example"}/>
                    </div>
                      :
                  <div className="d-flex justify-between name-example-area">
                      <div className="flex-grow-1">
                          <ApiName api={currentApi}/>
                          {hasApi && isShowDescription && !!currentApi.id ? <ApiDescription api={currentApi}/>:null}
                      </div>
                    <ApiExample api={currentApi}/>
                  </div>}


                  {isExample?<div className="d-flex-column">
                    <div className="ml20 mb10">名称</div>
                    <Input value={currentApi.exampleName} onChange={handler.exampleNameChanged} className="example-name" placeholder={"案例名称"}/>
                </div>:null}

                  {requestName}
                <div  className={isExample?"example-request":''}>
                    <div className="ml10 mr10">
                        <ApiUrlArea api={currentApi}/>
                    </div>
                    <div className="config-area">
                        <ApiConfigArea  api={currentApi}/>
                    </div>
                </div>
                  {isExample? <div className="ml20 mt10 mb10">响应:</div>:null}
                <div className={isExample?"example-response":'no-example-response'}>
                    <ApiResponse api={currentApi}/>
                </div>
            </div>:
            <div className="content-wrapper  d-flex justify-center align-center">
                 <img src={ImgApiCloud}/>
            </div>}
        </div>
    )
}
