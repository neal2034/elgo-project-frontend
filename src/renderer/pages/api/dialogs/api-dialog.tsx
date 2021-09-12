import React, {useEffect, useState} from "react";
import {Modal, Input, Tree} from "antd";
import EffButton from "../../../components/eff-button/eff-button";
import {addApi, addApiTreeItem, editApiTreeItem} from '@slice/apiSlice'
import {useDispatch} from "react-redux";
import './api-dialog.less'
import globalColor from "@config/globalColor";

const {TextArea} = Input

interface IApiDlgProps{
    visible:boolean,
    closeDlg: ()=>void,
    mode:'add'|'edit'|'add-api',
    parentId?:number,
    editItem?:any,
    collections?:any,
}

export default function ApiDialog(props: IApiDlgProps){
    const {visible, closeDlg, mode, parentId, editItem={}, collections} = props;
    const dispatch = useDispatch();
    const [title,setTitle] = useState("新增API");
    const [errorNameEmpty, setErrorNameEmpty] = useState(false);    //显示名称为空错误
    const [errorChooseCollection, setErrorChooseCollection] = useState(false);  //显示未选中保存API 集合错误
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [selectedKeys , setSelectedKeys] = useState<any[]>();

    useEffect(()=>{
        if(mode == 'add'){
            setTitle('新增API')
        }else if(mode == 'edit'){
            setName(editItem.name)
            setDescription(editItem.description)
            setTitle("修改API")
        }

    },[mode])

    const response = {
        //确认添加API
        handleConfirm:()=>{

            let hasError = false;
            if(!name){
                setErrorNameEmpty(true)
                hasError = true
            }
            if(mode==='add-api' && (!selectedKeys || selectedKeys!.length==0)){
                setErrorChooseCollection(true);
                hasError = true;
            }
            if(hasError) return;
            if(mode=='add'){

                const payload = {
                    name:name!,
                    description,
                    parentId:parentId!,
                }
                dispatch(addApiTreeItem(payload))
            }else if(mode==='edit'){
                const payload = {
                    name:name!,
                    description,
                    id:editItem.id
                }
                dispatch(editApiTreeItem(payload))
            }else if(mode==='add-api'){
                const parentId = selectedKeys![0]
                const payload = {
                    parentId,
                    name:name!,
                    description,
                }
                dispatch(addApi(payload))

            }

            closeDlg();

        },

        //选中需要保存的树节点
        handleSelectApiCollection: (selectedKeys:any)=>{
            setErrorChooseCollection(false)
            setSelectedKeys(selectedKeys)
        },

        dlgClean: ()=>{
            setName(undefined)
            setDescription(undefined)
        }
    }

    const ui = {
        footArea : [
            <EffButton onClick={closeDlg} round={true} key={"cancel"} text={"取消"}/>,
            <EffButton onClick={response.handleConfirm} round={true} type={"filled"}  key={"ok"} text={"确定"}/>,
        ]
    }

    return (
        <Modal destroyOnClose={true} title={title} closable={false} afterClose={response.dlgClean} footer={ui.footArea} visible={visible}>
            <Input onFocus={()=>setErrorNameEmpty(false)} value={name} placeholder={"API  名称"} onChange={e=>setName(e.target.value)}/>
            {errorNameEmpty?<span style={{color:globalColor.mainRed3, fontSize:'12px'}}>请输入API名称</span>:null}
            <TextArea onChange={e=>setDescription(e.target.value)} value={description} className="mt10" autoSize={{minRows: 15, maxRows: 20}}/>
            { collections? <React.Fragment>
                    <div className="mt10">选择API集合或分组</div>
                    {errorChooseCollection?<span style={{color:globalColor.mainRed3, fontSize:'12px'}}>请选择对应集合或分组</span>:null}
                    <div className={"api-collections mt10"}>
                        <Tree onSelect={response.handleSelectApiCollection} treeData={collections}/>
                    </div>
                </React.Fragment>:null}
        </Modal>
    )
}
