import React, {useState} from "react";
import './api-wrapper.less'
import {Input, Tree} from "antd";
import { SearchOutlined, RightOutlined } from '@ant-design/icons';
// @ts-ignore
import ImgApiSet from "~assets/imgs/api-set.png"
// @ts-ignore
import ImgApiFolder from '~assets/imgs/api-folder.png'


export default function ApiSideBar(){
    const [expandedKeys, setExpandedKeys] = useState<number[]>( []);
    let apiSets1 = [{title:'set1', key:1, type:'SET'},{title:'set2',type:'SET', key:2, children:[
            {title:'group1', key:11, type:'GROUP', children:[{title:'api2', type:'API', method:'POST', key:411}, {title:'api2', type:'API', method:'GET', key:412}]}, {title:'group2', key:12, type:'GROUP'},{title:'api2', type:'API', method:'put', key:41}
        ]}, ]

    const onSelect = (selectedKeys: React.Key[], info: any) => {

        let key =  info.node.key
        let keys = Object.assign([], expandedKeys)
        let keyIndex = keys.indexOf(key)
        if(keyIndex === -1){
            keys.push(key)
        }else{
            keys.splice(keyIndex, 1)
        }
        setExpandedKeys(keys)
    };

    const titleRender = (data:any)=>{
        let isSelected = expandedKeys.indexOf(data.key)>-1
        if(data.type === 'SET'){
            return  <div className={'api-set'}>
                <RightOutlined className={`ml10 ${isSelected ? "selected" : ""}`}  />

                <img src={ImgApiSet} width="16" className="ml10 mr10"/>{data.title}</div>
        }else if(data.type === 'GROUP'){
            return  <div className="api-folder">
                <RightOutlined className={`ml10 ${isSelected ? "selected" : ""}`}  />
                <img src={ImgApiFolder}   className="ml10 mr10" width="14"/>
                {data.title}+GROUP</div>
        }
        else if(data.type === 'API'){
            let method = data.method.toUpperCase();
            method = method==='DELETE'? 'DEL':method
            let methodClassName = method.toLowerCase()
            return <div className="api-item">
                <span className={'mr10 ml10 api-method '+methodClassName}>{method}</span>
                {data.title}
            </div>
        }else{
            return null;
        }

    }


    return (
        <div className="api-sidebar d-flex-column">
            <Input className="search-api ml5 mt5 mr5"  prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}/>
            <span className="mt10 btn-add-set">+ 添加集合</span>
            <Tree
                expandedKeys={expandedKeys}
                onSelect={onSelect}
                  blockNode={true} titleRender={titleRender} treeData={apiSets1}/>
        </div>
    )
}
