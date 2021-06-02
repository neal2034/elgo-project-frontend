import React, {useEffect, useState} from "react";
import './api-wrapper.less'
import {Input, Tree} from "antd";
import { SearchOutlined, RightOutlined } from '@ant-design/icons';
import ImgApiSet from "@imgs/api-set.png"
import ImgApiFolder from '@imgs/api-folder.png'
import ApiSetDialog from "../dialogs/api-set-dialog";
import {listApiTreeItems} from '../apiSlice'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";


export default function ApiSideBar(){
    //对树形数据进行映射，主要用来添加key 字段
    const mapTreeData = (data:any) =>{
        return data.map((item:any)=>{
            return {...item, key:item.id, children: item.children == null || item.children.length <= 0
                    ? []
                    : mapTreeData(item.children)}
        })
    }

    const treeItems = useSelector((state:RootState)=>{
         return mapTreeData(state.api.apiTreeItems)
    })
    const [expandedKeys, setExpandedKeys] = useState<number[]>( []);
    const [visibleApiSetDlg, setApiSetDlgVisible] = useState(false);
    let apiSetDlgTitle = "添加集合";
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(listApiTreeItems())
    }, [dispatch])

    const goAddApiSet = ()=>{
        apiSetDlgTitle = "添加集合"
        setApiSetDlgVisible(true)
    }
    const closeDialog = ()=>{
        setApiSetDlgVisible(false)
    }



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

                <img src={ImgApiSet} width="16" className="ml10 mr10"/>{data.name}</div>
        }else if(data.type === 'GROUP'){
            return  <div className="api-folder">
                <RightOutlined className={`ml10 ${isSelected ? "selected" : ""}`}  />
                <img src={ImgApiFolder}   className="ml10 mr10" width="14"/>
                {data.name}+GROUP</div>
        }
        else if(data.type === 'API'){
            let method = data.method.toUpperCase();
            method = method==='DELETE'? 'DEL':method
            let methodClassName = method.toLowerCase()
            return <div className="api-item">
                <span className={'mr10 ml10 api-method '+methodClassName}>{method}</span>
                {data.name}
            </div>
        }else{
            return null;
        }

    }


    return (
        <div className="api-sidebar d-flex-column">
            <Input className="search-api ml5 mt5 mr5"  prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}/>
            <span className="mt10 btn-add-set" onClick={goAddApiSet}>+ 添加集合</span>
            <Tree expandedKeys={expandedKeys} onSelect={onSelect} blockNode={true} titleRender={titleRender} treeData={treeItems}/>
            <ApiSetDialog visible={visibleApiSetDlg} closeDlg={closeDialog} title={apiSetDlgTitle} />
        </div>
    )
}
