import React, {useEffect, useState} from "react";
import './api-wrapper.less'
import {Input, Tree, Popover, Menu, Dropdown,Button} from "antd";
import { SearchOutlined, RightOutlined } from '@ant-design/icons';
import ImgApiSet from "@imgs/api-set.png"
import ImgApiFolder from '@imgs/api-folder.png'
import ApiSetDialog from "../dialogs/api-set-dialog";
import {listApiTreeItems} from '../apiSlice'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import ImgAddApiGroup from '@imgs/api/api-group-add.png'
import ImgAddApi from '@imgs/api/add-api.png'
import ImgEdit from '@imgs/api/pen-edit.png'
import ImgRemove from '@imgs/api/remove.png'
import ApiDialog from "../dialogs/api-dialog";

/**
 * 侧边栏
 * @constructor
 */
export default function ApiSideBar(){

    const dispatch = useDispatch();
    const [visibleApiMenuSetId, setVisibleApiMenuSetId] = useState(-1); //api 集合菜单可见性
    const [expandedKeys, setExpandedKeys] = useState<number[]>( []);  // 展开树节点的key
    const [visibleApiSetDlg, setApiSetDlgVisible] = useState(false); //API 集合/分组对话框可见性
    const [visibleApiDlg, setApiDlgVisible] = useState(false);      // API  对话框可见性
    const [dlgTitle, setDlgTitle] = useState("添加集合"); //对话框标题
    const [dlgType, setDlgType] = useState<'set'|'group'>('set');
    const [apiDlgMode, setApiDlgMode] = useState<'add'|'edit'>('add');
    const [parentId, setParentId] = useState<number>()
    const [apiParentId, setApiParentId]=useState<number>()

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

    const response = {
        goAddApiSet : ()=>{
            setDlgTitle("添加集合")
            setDlgType('set');
            setApiSetDlgVisible(true)
        },
        treeItemSelected: (selectedKeys: React.Key[], info: any) => {

            let key =  info.node.key
            let keys = Object.assign([], expandedKeys)
            let keyIndex = keys.indexOf(key)
            if(keyIndex === -1){
                keys.push(key)
            }else{
                keys.splice(keyIndex, 1)
            }
            setExpandedKeys(keys)
        },
        closeDialog: ()=>{
            setApiSetDlgVisible(false)
        }
    }

    useEffect(()=>{
        dispatch(listApiTreeItems())
    }, [dispatch])


    const titleRender = (data:any)=>{

        let isSelected = expandedKeys.indexOf(data.key)>-1
        const response = {
            menuShow:(visible:boolean)=>{
                let id = visible? data.id:-1;
                setVisibleApiMenuSetId(id)

            },
            //响应集合弹出菜单
            menuSelected:({key}:{key:any})=>{
                switch (key){
                    case 'add-group':
                        response.goAddApiGroup()
                        break;
                    case 'add-api':
                        response.goAddApi()
                        break;
                }
            },
            goAddApiGroup:()=>{
                setDlgTitle("添加分组")
                setDlgType('group');
                setParentId(data.id)
                setApiSetDlgVisible(true);
            },
            goAddApi:()=>{
                setApiDlgMode('add');
                setApiParentId(data.id)
                setApiDlgVisible(true)
            }
        }
        const ui = {
            apiSetMenu: (<Menu onClick={response.menuSelected}>
                    <Menu.Item key={"add-group"}>
                        <img alt={"add-api-group"} src={ImgAddApiGroup} width={14}/>
                        <span className="ml5">添加分组</span>
                    </Menu.Item>
                    <Menu.Item key={"add-api"}>
                        <img alt={"add-api"} src={ImgAddApi} width={14}/>
                        <span className={"ml5"}>添加API</span>
                    </Menu.Item>
                    <Menu.Item key={"edit-set"}>
                        <img alt={"edit-api-set"} src={ImgEdit} width={14}/>
                        <span className={"ml5"}>编辑</span>
                    </Menu.Item>
                    <Menu.Item key={"del-set"}>
                        <img alt={"del-api-set"} src={ImgRemove} width={14}/>
                        <span className={"ml5"}>删除</span>
                    </Menu.Item>
                </Menu>)
        }


        if(data.type === 'SET'){
            return  <div className={'api-set'} onMouseEnter={()=>setVisibleApiMenuSetId(data.id)} onMouseLeave={()=>setTimeout(()=>setVisibleApiMenuSetId(-1), 300)}>
                <RightOutlined className={`ml10 ${isSelected ? "selected" : ""}`}  />
                <img alt="api-set" src={ImgApiSet} width="16" className="ml10 mr10"/>{data.name}
                {data.id===visibleApiMenuSetId? <Dropdown className="api-set-menu-container" onVisibleChange={response.menuShow} overlay={ui.apiSetMenu} placement="bottomCenter">

                    <div className="api-set-menu">
                        <div className="menu-circle"/>
                        <div className="menu-circle"/>
                        <div className="menu-circle"/>
                    </div>
                </Dropdown>:null}
            </div>
        }else if(data.type === 'GROUP'){
            return  <div className="api-folder">
                <RightOutlined className={`ml10 ${isSelected ? "selected" : ""}`}  />
                <img alt={"api-group"} src={ImgApiFolder}   className="ml10 mr10" width="14"/>{data.name}
            </div>
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
            <span className="mt10 btn-add-set" onClick={response.goAddApiSet}>+ 添加集合</span>
            <Tree expandedKeys={expandedKeys} onSelect={response.treeItemSelected} blockNode={true} titleRender={titleRender} treeData={treeItems}/>
            <ApiSetDialog dlgType={dlgType} parentId={parentId} visible={visibleApiSetDlg} closeDlg={response.closeDialog} title={dlgTitle} />
            <ApiDialog visible={visibleApiDlg} parentId={apiParentId!} mode={apiDlgMode} closeDlg={()=>setApiDlgVisible(false)}/>
        </div>
    )
}
