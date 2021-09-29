import React, {useEffect} from "react";
import './app-download.less'
import {Col, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {elgoVersionThunks} from "@slice/elgoVersionSlice";


export default function AppDownload(){
    const dispatch = useDispatch()
    const elgoVersions = useSelector((state:RootState) => state.elgoVersion.elgoVersions)
    useEffect(()=>{
        dispatch(elgoVersionThunks.listElgoVersions())
    },[])


    return (
        <div className="download">
             <Row  className="mb20 title">
                 <Col span={4}>版本</Col>
                 <Col span={12}>描述</Col>
                 <Col span={4}>Mac App</Col>
             </Row>
            {elgoVersions.map((item:any)=><Row key={item.id} className="mt20">
                <Col span={4}>{item.version}</Col>
                <Col span={12}>{item.description}</Col>
                <Col span={4}>
                    <a href={item.mapAppLink}>{item.macAppName}</a>
                </Col>
            </Row>)}
        </div>
    )
}
