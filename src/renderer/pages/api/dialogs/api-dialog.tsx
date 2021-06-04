import React, {useEffect, useState} from "react";
import {Modal,Input} from "antd";
import EffButton from "../../../components/eff-button/eff-button";
import {addApiTreeItem} from '@slice/apiSlice'
import {useDispatch} from "react-redux";
import globalColor from "@config/globalColor";

const {TextArea} = Input

interface IApiDlgProps{
    visible:boolean,
    closeDlg: ()=>void,
    mode:'add'|'edit',
    parentId:number
}

export default function ApiDialog(props: IApiDlgProps){
    const {visible, closeDlg, mode, parentId} = props;
    const dispatch = useDispatch();
    const [title,setTitle] = useState("新增API");
    const [errorNameEmpty, setErrorNameEmpty] = useState(false);    //显示名称为空错误
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string>();

    useEffect(()=>{
        if(mode == 'add'){
            setTitle('新增API')
        }else if(mode == 'edit'){
            setTitle("修改API")
        }
    },[])

    const response = {
        //确认添加API
        handleConfirm:()=>{
            if(!name){
                setErrorNameEmpty(true)
                return
            }
            let payload = {
                name,
                description,
                parentId,
            }
            dispatch(addApiTreeItem(payload))
            closeDlg();

        },
    }

    const ui = {
        footArea : [
            <EffButton onClick={closeDlg} round={true} key={"cancel"} text={"取消"}/>,
            <EffButton onClick={response.handleConfirm} round={true} type={"filled"}  key={"ok"} text={"确定"}/>,
        ]
    }

    return (
        <Modal destroyOnClose={true} title={title} closable={false} footer={ui.footArea} visible={visible}>
            <Input onFocus={()=>setErrorNameEmpty(false)} value={name} placeholder={"API  名称"} onChange={e=>setName(e.target.value)}/>
            {errorNameEmpty?<span style={{color:globalColor.mainRed3, fontSize:'12px'}}>请输入集合名称</span>:null}
            <TextArea onChange={e=>setDescription(e.target.value)} value={description} className="mt10" autoSize={{minRows: 15, maxRows: 20}}/>
        </Modal>
    )
}
