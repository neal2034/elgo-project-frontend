import React, {useEffect, useState} from "react";
import {Modal, Input, Tabs, Select, Button} from "antd";
import './api-set-dialog.less'
import EffButton from "../../../components/eff-button/eff-button";
import globalColor from "@config/globalColor";
import {addApiSet, addApiGroup, editApiSet} from '@slice/apiSlice'
import {useDispatch} from "react-redux";

const {TabPane} = Tabs
const {TextArea} = Input
const {Option} = Select



interface ApiSetDlgProps{
    visible:boolean,
    closeDlg:()=>void,
    dlgType:'set' | 'group',     //标识当前操作api集合 还是 api 分组
    mode:'add'|'edit',
    apiSet?:any,
    parentId?:number
}

export default function ApiSetDialog(props:ApiSetDlgProps){
    const {visible, apiSet, closeDlg, dlgType, mode} = props
    let title = mode === 'add'? '新建':'编辑'
    title += dlgType === 'set'?"集合":'分组'
    const parentId = props.parentId!
    const dispatch = useDispatch();
    const [errorNameEmpty, setErrorNameEmpty] = useState(false)
    const [name,setApiSetName] = useState(apiSet && apiSet.name)
    const [authType, setAuthType] = useState( (apiSet && apiSet.authType) || 'NONE')
    const [description, setDescription] = useState(apiSet && apiSet.description)
    const [authToken, setAuthToken] = useState(apiSet && apiSet.authToken)


    useEffect(()=>{
        if(mode==='edit' && dlgType=== 'set'){
            setApiSetName(apiSet.name)
            setDescription(apiSet.description)
            setAuthToken(apiSet.authToken)
            setAuthType(apiSet.authType)
        }

    },[apiSet])

    const response = {
        handleConfirm:()=>{
            if(dlgType === 'set' && mode=== 'add'){
                response.goAddSet();
            }else if(dlgType === 'group' && mode === 'add'){
                response.goAddGroup()
            }else if (dlgType === 'set' && mode==='edit'){
                response.goEditApiSet();
            }
        },

        goEditApiSet: ()=>{
            if(!name){
                setErrorNameEmpty(true)
                return
            }
            let payload = {
                name,
                authType,
                description,
                authToken,
                id:apiSet.id
            }
            dispatch(editApiSet(payload))
            closeDlg()
        },

        goAddSet: ()=>{
            if(!name){
                setErrorNameEmpty(true)
                return
            }
            let payload = {
                name,
                authType,
                description,
                authToken,
            }
            dispatch(  addApiSet(payload))
            closeDlg();
        },

        goAddGroup: ()=>{
            if(!name){
                setErrorNameEmpty(true)
                return
            }
            let payload = {
                name,
                authType,
                description,
                authToken,
                parentId,
            }
            dispatch(addApiGroup(payload))
            closeDlg();
        }
    }


    const updateApiSetName = (e:any)=>{
        setApiSetName(e.target.value)
    }

    const titleArea = <div  className="dlg-head font-title">{title}</div>
    const tabHeight = 350;
    const footArea = [
        <EffButton onClick={closeDlg} round={true} key={"cancel"} text={"取消"}/>,
        <EffButton onClick={response.handleConfirm} round={true} type={"filled"}  key={"ok"} text={"确定"}/>,
    ]


    return (
        <Modal destroyOnClose={true} title={titleArea} closable = {false} footer={footArea}   visible={visible}>
             <Input onFocus={()=>setErrorNameEmpty(false)} value={name} placeholder={"集合名称"} onChange={updateApiSetName}/>
            {errorNameEmpty?<span style={{color:globalColor.mainRed3, fontSize:'12px'}}>请输入集合名称</span>:null}
             <Tabs>
                <TabPane tab={"简介"} key={"description"} style={{ height: tabHeight }}>
                    <TextArea onChange={e=>setDescription(e.target.value)} value={description} autoSize={{minRows: 15, maxRows: 20}}/>
                </TabPane>
                 <TabPane tab={"鉴权"} key={"auth"} style={{ height: tabHeight }}>
                     <div className="d-flex">
                         <span style={{ width: 80 }} className="mr10">鉴权类型:</span>
                         <Select onChange={value=>setAuthType(value)} defaultValue={authType} style={{ width: 200 }}>
                             <Option value="NONE">无</Option>
                             <Option value="BEARER">Bearer Token</Option>
                         </Select>
                     </div>
                     {
                         <div className="d-flex mt20">
                             <span style={{ width: 80 }} className="mr10">Token:</span>
                             <Input value={authToken} onChange={e=>setAuthToken(e.target.value)} style={{ width: 200 }}/>
                         </div>
                     }
                 </TabPane>
             </Tabs>
        </Modal>
    )
}
