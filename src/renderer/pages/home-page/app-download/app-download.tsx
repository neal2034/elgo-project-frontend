import React from "react";
import './app-download.less'
import {Col, Row} from "antd";


export default function AppDownload(){
    const testData = [
        {version:'1.0', description:'Here is description', link:'http://www.abc.com/test.dmg', name:'Elgo1.0.dmg'},
        {version:'2.0', description:'Here is description', link:'http://www.abc.com/test.dmg', name:'Elgo1.0.dmg'},
        {version:'3.0', description:'Here is description', link:'http://www.abc.com/test.dmg', name:'Elgo1.0.dmg'},
    ]

    return (
        <div className="download">
             <Row  className="mb20 title">
                 <Col span={4}>版本</Col>
                 <Col span={12}>描述</Col>
                 <Col span={4}>Mac App</Col>
             </Row>
            {testData.map((item:any)=><Row className="mt20">
                <Col span={4}>{item.version}</Col>
                <Col span={12}>{item.description}</Col>
                <Col span={4}>
                    <a href={item.link}>{item.name}</a>
                </Col>
            </Row>)}
        </div>
    )
}
